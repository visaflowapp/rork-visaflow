import { getSherpaClient, SherpaClient } from '../sherpa/client';
import type { SherpaVisaResponse, SherpaVisaRequirement } from '../sherpa/types';
import { VisaRuleModel, type VisaType, type VisaDocument } from '../../models/visa-rule';

interface VisaRuleNormalized {
  citizenship_iso2: string;
  destination_iso2: string;
  visa_type: VisaType;
  allowed_stay_days: number | null;
  stay_period_description: string | null;
  documents: VisaDocument[];
  processing_time_days: number | null;
  passport_validity_requirement_months: number | null;
  restrictions: string[];
  notes_structured: string[];
  raw_payload: unknown;
  source_version: string;
  payload_hash: string;
}

export class VisaIngestService {
  private sherpaClient: SherpaClient;

  constructor() {
    this.sherpaClient = getSherpaClient();
  }

  private normalizeVisaType(sherpaType: string, sherpaCategory: string): VisaType {
    const type = sherpaType.toLowerCase();
    const category = sherpaCategory.toLowerCase();

    if (category.includes('visa free') || type.includes('visa free') || type.includes('visa-free')) {
      return 'visa_free';
    }
    if (type.includes('evisa') || type.includes('e-visa') || type.includes('electronic')) {
      return 'evisa';
    }
    if (type.includes('on arrival') || type.includes('voa')) {
      return 'visa_on_arrival';
    }
    if (type.includes('embassy') || category.includes('embassy') || type.includes('consulate')) {
      return 'embassy_required';
    }
    if (type.includes('transit')) {
      return 'transit';
    }

    return 'other';
  }

  private extractStayDays(requirement: SherpaVisaRequirement): number | null {
    if (!requirement.allowed_stay) {
      return null;
    }

    const { value, description } = requirement.allowed_stay;

    if (value !== null && value !== undefined) {
      return value;
    }

    if (description) {
      const match = description.match(/(\d+)\s*(day|days)/i);
      if (match) {
        return parseInt(match[1], 10);
      }
    }

    return null;
  }

  private extractProcessingTimeDays(requirement: SherpaVisaRequirement): number | null {
    if (!requirement.processing_time) {
      return null;
    }

    const { min_days, max_days } = requirement.processing_time;

    if (max_days !== null && max_days !== undefined) {
      return max_days;
    }

    if (min_days !== null && min_days !== undefined) {
      return min_days;
    }

    return null;
  }

  private normalizeDocuments(requirement: SherpaVisaRequirement): VisaDocument[] {
    if (!requirement.documents || requirement.documents.length === 0) {
      return [];
    }

    return requirement.documents.map(doc => ({
      name: doc.type || 'Document',
      required: doc.required,
      note: doc.description || doc.notes || null,
    }));
  }

  private extractRestrictions(requirement: SherpaVisaRequirement): string[] {
    if (!requirement.restrictions || requirement.restrictions.length === 0) {
      return [];
    }

    return requirement.restrictions.map(r => r.description);
  }

  private normalizeVisaResponse(
    response: SherpaVisaResponse,
    citizenshipIso2: string,
    destinationIso2: string
  ): VisaRuleNormalized {
    console.log('[VisaIngestService] Normalizing visa response...');
    
    const primaryRequirement = response.requirements?.[0];
    
    if (!primaryRequirement) {
      throw new Error('No visa requirements found in Sherpa response');
    }

    const visaType = this.normalizeVisaType(
      primaryRequirement.type,
      primaryRequirement.category
    );
    
    const allowedStayDays = this.extractStayDays(primaryRequirement);
    const processingTimeDays = this.extractProcessingTimeDays(primaryRequirement);
    const documents = this.normalizeDocuments(primaryRequirement);
    const restrictions = this.extractRestrictions(primaryRequirement);

    const normalized: VisaRuleNormalized = {
      citizenship_iso2: citizenshipIso2.toUpperCase(),
      destination_iso2: destinationIso2.toUpperCase(),
      visa_type: visaType,
      allowed_stay_days: allowedStayDays,
      stay_period_description: primaryRequirement.allowed_stay?.description || null,
      documents,
      processing_time_days: processingTimeDays,
      passport_validity_requirement_months: 
        primaryRequirement.passport_requirements?.validity_months || null,
      restrictions,
      notes_structured: primaryRequirement.notes || [],
      raw_payload: response,
      source_version: response.version || 'unknown',
      payload_hash: SherpaClient.generatePayloadHash(response),
    };

    console.log('[VisaIngestService] Normalized visa rule:', {
      pair: `${citizenshipIso2} -> ${destinationIso2}`,
      visaType: normalized.visa_type,
      allowedStayDays: normalized.allowed_stay_days,
      processingTimeDays: normalized.processing_time_days,
    });

    return normalized;
  }

  async ingestVisaRule(
    citizenshipIso2: string,
    destinationIso2: string
  ): Promise<VisaRuleNormalized> {
    console.log(
      `[VisaIngestService] Ingesting visa rule: ${citizenshipIso2} -> ${destinationIso2}`
    );

    try {
      const sherpaResponse = await this.sherpaClient.getVisaRequirements(
        citizenshipIso2,
        destinationIso2
      );

      const normalized = this.normalizeVisaResponse(
        sherpaResponse,
        citizenshipIso2,
        destinationIso2
      );

      const savedRule = await VisaRuleModel.upsert(normalized);
      
      console.log(`[VisaIngestService] Successfully ingested visa rule: ${savedRule.id}`);

      return normalized;
    } catch (error) {
      console.error(
        `[VisaIngestService] Failed to ingest visa rule ${citizenshipIso2} -> ${destinationIso2}:`,
        error
      );
      throw error;
    }
  }

  async ingestMultiple(
    pairs: { citizenship: string; destination: string }[]
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    console.log(`[VisaIngestService] Ingesting ${pairs.length} visa rules...`);

    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const pair of pairs) {
      try {
        await this.ingestVisaRule(pair.citizenship, pair.destination);
        success++;
        
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        failed++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`${pair.citizenship} -> ${pair.destination}: ${errorMessage}`);
        console.error(`[VisaIngestService] Failed pair:`, pair, errorMessage);
      }
    }

    console.log(`[VisaIngestService] Ingestion complete: ${success} success, ${failed} failed`);

    return { success, failed, errors };
  }

  async refreshVisaRule(
    citizenshipIso2: string,
    destinationIso2: string
  ): Promise<{ changed: boolean; oldHash?: string; newHash?: string }> {
    console.log(
      `[VisaIngestService] Refreshing visa rule: ${citizenshipIso2} -> ${destinationIso2}`
    );

    const existingRule = await VisaRuleModel.findByPair(
      citizenshipIso2,
      destinationIso2
    );

    const oldHash = existingRule?.payload_hash;

    await this.ingestVisaRule(citizenshipIso2, destinationIso2);

    const newRule = await VisaRuleModel.findByPair(
      citizenshipIso2,
      destinationIso2
    );

    const changed = oldHash !== newRule?.payload_hash;

    console.log(`[VisaIngestService] Refresh complete. Changed: ${changed}`);

    return {
      changed,
      oldHash,
      newHash: newRule?.payload_hash,
    };
  }
}

let cachedService: VisaIngestService | null = null;

export function getVisaIngestService(): VisaIngestService {
  if (!cachedService) {
    cachedService = new VisaIngestService();
  }
  return cachedService;
}

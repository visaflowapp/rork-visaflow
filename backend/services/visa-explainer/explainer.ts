import type { VisaRule, VisaType } from '../../models/visa-rule';

export interface VisaExplanation {
  summary: string;
  checklist: ChecklistItem[];
  alerts: string[];
  recommendations: string[];
}

export interface ChecklistItem {
  item: string;
  required: boolean;
  note: string | null;
}

export class VisaExplainerService {
  private formatVisaType(visaType: VisaType): string {
    const typeMap: Record<VisaType, string> = {
      visa_free: 'visa-free entry',
      evisa: 'electronic visa (eVisa)',
      visa_on_arrival: 'visa on arrival',
      embassy_required: 'embassy visa',
      transit: 'transit visa',
      other: 'special visa arrangement',
    };

    return typeMap[visaType] || 'visa';
  }

  private generateSummary(
    rule: VisaRule,
    citizenship: string,
    destination: string
  ): string {
    const visaTypeLabel = this.formatVisaType(rule.visa_type);
    const parts: string[] = [];

    parts.push(`${citizenship} citizens: ${visaTypeLabel}`);

    if (rule.visa_type === 'visa_free') {
      if (rule.allowed_stay_days) {
        parts.push(`for up to ${rule.allowed_stay_days} days`);
      }
      if (rule.passport_validity_requirement_months) {
        parts.push(
          `Passport must be valid for ${rule.passport_validity_requirement_months} months from entry.`
        );
      }
      parts.push('No visa application required.');
    } else if (rule.visa_type === 'evisa') {
      parts.push('for tourism/business purposes.');
      if (rule.processing_time_days) {
        parts.push(
          `Apply online. Processing typically takes ${rule.processing_time_days} business days.`
        );
      } else {
        parts.push('Apply online before travel.');
      }
      if (rule.allowed_stay_days) {
        parts.push(`Valid for stays up to ${rule.allowed_stay_days} days.`);
      }
    } else if (rule.visa_type === 'visa_on_arrival') {
      parts.push('available at airport.');
      if (rule.allowed_stay_days) {
        parts.push(`Valid for ${rule.allowed_stay_days} days.`);
      }
      parts.push('Have supporting documents ready.');
    } else if (rule.visa_type === 'embassy_required') {
      parts.push('required. Apply at embassy or consulate.');
      if (rule.processing_time_days) {
        const weeks = Math.ceil(rule.processing_time_days / 7);
        parts.push(`Allow ${weeks}+ weeks for processing.`);
      } else {
        parts.push('Allow several weeks for processing.');
      }
    }

    return parts.join(' ');
  }

  private generateChecklist(rule: VisaRule): ChecklistItem[] {
    const checklist: ChecklistItem[] = [];

    checklist.push({
      item: 'Valid passport',
      required: true,
      note: rule.passport_validity_requirement_months
        ? `Must be valid for ${rule.passport_validity_requirement_months} months from entry`
        : 'Check validity requirements',
    });

    if (rule.documents && rule.documents.length > 0) {
      for (const doc of rule.documents) {
        checklist.push({
          item: doc.name,
          required: doc.required,
          note: doc.note,
        });
      }
    }

    if (rule.visa_type === 'evisa' || rule.visa_type === 'embassy_required') {
      checklist.push({
        item: 'Completed visa application',
        required: true,
        note: null,
      });
      checklist.push({
        item: 'Recent passport photo',
        required: true,
        note: 'Usually 2x2 inches, color',
      });
    }

    if (rule.visa_type === 'visa_on_arrival') {
      checklist.push({
        item: 'Return/onward ticket',
        required: true,
        note: 'Proof of departure',
      });
      checklist.push({
        item: 'Proof of accommodation',
        required: true,
        note: 'Hotel booking or invitation letter',
      });
    }

    return checklist;
  }

  private generateAlerts(rule: VisaRule): string[] {
    const alerts: string[] = [];

    if (rule.restrictions && rule.restrictions.length > 0) {
      for (const restriction of rule.restrictions) {
        alerts.push(restriction);
      }
    }

    if (rule.visa_type === 'embassy_required' && rule.processing_time_days) {
      if (rule.processing_time_days > 21) {
        alerts.push(
          `Long processing time: Apply at least ${Math.ceil(rule.processing_time_days / 7)} weeks before travel`
        );
      }
    }

    if (rule.passport_validity_requirement_months && rule.passport_validity_requirement_months >= 6) {
      alerts.push(
        'Your passport must be valid for 6 months beyond your entry date. Renew early if needed.'
      );
    }

    return alerts;
  }

  private generateRecommendations(rule: VisaRule): string[] {
    const recommendations: string[] = [];

    if (rule.visa_type === 'visa_free' || rule.visa_type === 'visa_on_arrival') {
      recommendations.push('Consider travel insurance for medical emergencies');
      recommendations.push('Keep copies of important documents');
    }

    if (rule.visa_type === 'evisa') {
      recommendations.push('Print your eVisa approval before departure');
      recommendations.push('Apply at least 2 weeks before travel to avoid delays');
    }

    if (rule.visa_type === 'embassy_required') {
      recommendations.push('Schedule embassy appointment early');
      recommendations.push('Prepare all documents before your appointment');
      recommendations.push('Consider expedited processing if available');
    }

    if (rule.notes_structured && rule.notes_structured.length > 0) {
      recommendations.push(...rule.notes_structured);
    }

    return recommendations;
  }

  explain(
    rule: VisaRule,
    citizenshipName: string,
    destinationName: string
  ): VisaExplanation {
    console.log(`[VisaExplainerService] Generating explanation for ${citizenshipName} -> ${destinationName}`);

    const explanation: VisaExplanation = {
      summary: this.generateSummary(rule, citizenshipName, destinationName),
      checklist: this.generateChecklist(rule),
      alerts: this.generateAlerts(rule),
      recommendations: this.generateRecommendations(rule),
    };

    console.log('[VisaExplainerService] Generated explanation:', {
      checklistItems: explanation.checklist.length,
      alerts: explanation.alerts.length,
      recommendations: explanation.recommendations.length,
    });

    return explanation;
  }

  quickSummary(rule: VisaRule): string {
    const visaTypeLabel = this.formatVisaType(rule.visa_type);
    
    if (rule.visa_type === 'visa_free') {
      const days = rule.allowed_stay_days || '90';
      return `Visa-free for up to ${days} days`;
    }

    if (rule.visa_type === 'evisa') {
      const days = rule.processing_time_days || '7';
      return `eVisa required (${days} days processing)`;
    }

    if (rule.visa_type === 'visa_on_arrival') {
      return 'Visa on arrival available';
    }

    if (rule.visa_type === 'embassy_required') {
      const weeks = rule.processing_time_days 
        ? Math.ceil(rule.processing_time_days / 7)
        : '2-4';
      return `Embassy visa required (${weeks} weeks)`;
    }

    return visaTypeLabel;
  }
}

let cachedService: VisaExplainerService | null = null;

export function getVisaExplainerService(): VisaExplainerService {
  if (!cachedService) {
    cachedService = new VisaExplainerService();
  }
  return cachedService;
}

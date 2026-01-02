import { publicProcedure } from '../../create-context';
import { VisaRuleModel } from '../../../models/visa-rule';
import { CountryModel } from '../../../models/country';
import { getVisaIngestService } from '../../../services/visa-ingest/ingestion';
import { getVisaExplainerService } from '../../../services/visa-explainer/explainer';
import { getTravelBuddyClient } from '../../../services/travelbuddy/client';
import { z } from 'zod';

export const checkVisaRoute = publicProcedure
  .input(z.object({
    citizenship: z.string().length(2),
    destination: z.string().length(2),
  }))
  .query(async ({ input }) => {
    console.log('[checkVisaRoute] Checking visa:', input);
    
    try {
      let visaRule = await VisaRuleModel.findByPair(
        input.citizenship,
        input.destination
      );

      if (!visaRule) {
        console.log('[checkVisaRoute] Rule not found, ingesting...');
        const ingestService = getVisaIngestService();
        await ingestService.ingestVisaRule(input.citizenship, input.destination);
        
        visaRule = await VisaRuleModel.findByPair(
          input.citizenship,
          input.destination
        );
      }

      if (!visaRule) {
        throw new Error('Failed to retrieve visa requirements');
      }

      const citizenshipCountry = await CountryModel.findByIso2(input.citizenship);
      const destinationCountry = await CountryModel.findByIso2(input.destination);

      const explainerService = getVisaExplainerService();
      const explanation = explainerService.explain(
        visaRule,
        citizenshipCountry?.name || input.citizenship,
        destinationCountry?.name || input.destination
      );

      return {
        success: true,
        data: {
          rule: visaRule,
          explanation,
        },
      };
    } catch (error) {
      console.error('[checkVisaRoute] Error:', error);
      throw error;
    }
  });

export const getVisaRuleRoute = publicProcedure
  .input(z.object({
    citizenship: z.string().length(2),
    destination: z.string().length(2),
  }))
  .query(async ({ input }) => {
    console.log('[getVisaRuleRoute] Fetching visa rule:', input);
    
    try {
      const visaRule = await VisaRuleModel.findByPair(
        input.citizenship,
        input.destination
      );

      if (!visaRule) {
        return {
          success: false,
          data: null,
          message: 'Visa rule not found. Use checkVisa to fetch and cache it.',
        };
      }

      return {
        success: true,
        data: visaRule,
      };
    } catch (error) {
      console.error('[getVisaRuleRoute] Error:', error);
      throw error;
    }
  });

export const checkTravelBuddyRoute = publicProcedure
  .input(z.object({
    from: z.string(),
    to: z.string(),
    tripType: z.string(),
    purpose: z.string(),
  }))
  .query(async ({ input }) => {
    console.log('[checkTravelBuddyRoute] Checking requirements:', input);
    
    try {
      const client = getTravelBuddyClient();
      const result = await client.getVisaRequirements(
        input.from,
        input.to,
        input.tripType,
        input.purpose
      );

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('[checkTravelBuddyRoute] Error:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch visa requirements: ${error.message}`);
      }
      throw new Error('Failed to fetch visa requirements');
    }
  });

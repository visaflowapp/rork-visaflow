import { publicProcedure } from '../../create-context';
import { getSherpaClient } from '../../../services/sherpa/client';
import { CountryModel } from '../../../models/country';
import { z } from 'zod';

export const syncCountriesRoute = publicProcedure
  .mutation(async () => {
    console.log('[syncCountriesRoute] Starting country sync...');
    
    try {
      const sherpaClient = getSherpaClient();
      const sherpaCountries = await sherpaClient.listCountries();

      console.log(`[syncCountriesRoute] Retrieved ${sherpaCountries.length} countries from Sherpa`);

      const countriesToUpsert = sherpaCountries.map(country => ({
        iso2: country.code,
        name: country.name,
        citizenship_label: null,
        region: null,
        aliases: null,
      }));

      const savedCountries = await CountryModel.bulkUpsert(countriesToUpsert);

      console.log(`[syncCountriesRoute] Synced ${savedCountries.length} countries`);

      return {
        success: true,
        message: `Successfully synced ${savedCountries.length} countries`,
        count: savedCountries.length,
      };
    } catch (error) {
      console.error('[syncCountriesRoute] Error:', error);
      throw new Error('Failed to sync countries');
    }
  });

export const ingestVisaRuleRoute = publicProcedure
  .input(z.object({
    citizenship: z.string().length(2),
    destination: z.string().length(2),
  }))
  .mutation(async ({ input }) => {
    console.log('[ingestVisaRuleRoute] Ingesting visa rule:', input);
    
    const { getVisaIngestService } = await import('../../../services/visa-ingest/ingestion');
    
    try {
      const ingestService = getVisaIngestService();
      await ingestService.ingestVisaRule(input.citizenship, input.destination);

      return {
        success: true,
        message: `Ingested visa rule for ${input.citizenship} -> ${input.destination}`,
      };
    } catch (error) {
      console.error('[ingestVisaRuleRoute] Error:', error);
      throw error;
    }
  });

export const ingestMultipleRoute = publicProcedure
  .input(z.object({
    pairs: z.array(z.object({
      citizenship: z.string().length(2),
      destination: z.string().length(2),
    })),
  }))
  .mutation(async ({ input }) => {
    console.log('[ingestMultipleRoute] Ingesting multiple visa rules:', input.pairs.length);
    
    const { getVisaIngestService } = await import('../../../services/visa-ingest/ingestion');
    
    try {
      const ingestService = getVisaIngestService();
      const result = await ingestService.ingestMultiple(input.pairs);

      return {
        ingestedCount: result.success,
        failedCount: result.failed,
        errors: result.errors,
      };
    } catch (error) {
      console.error('[ingestMultipleRoute] Error:', error);
      throw error;
    }
  });

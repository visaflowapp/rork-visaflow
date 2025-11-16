import { publicProcedure } from '../../create-context';
import { CountryModel } from '../../../models/country';
import { z } from 'zod';

export const listCountriesRoute = publicProcedure
  .query(async () => {
    console.log('[listCountriesRoute] Fetching countries...');
    
    try {
      const countries = await CountryModel.findAll();
      
      return {
        success: true,
        data: countries,
        count: countries.length,
      };
    } catch (error) {
      console.error('[listCountriesRoute] Error:', error);
      throw new Error('Failed to fetch countries');
    }
  });

export const searchCountriesRoute = publicProcedure
  .input(z.object({
    query: z.string().min(1),
  }))
  .query(async ({ input }) => {
    console.log('[searchCountriesRoute] Searching:', input.query);
    
    try {
      const countries = await CountryModel.search(input.query);
      
      return {
        success: true,
        data: countries,
        count: countries.length,
      };
    } catch (error) {
      console.error('[searchCountriesRoute] Error:', error);
      throw new Error('Failed to search countries');
    }
  });

export const getCountryRoute = publicProcedure
  .input(z.object({
    iso2: z.string().length(2),
  }))
  .query(async ({ input }) => {
    console.log('[getCountryRoute] Fetching country:', input.iso2);
    
    try {
      const country = await CountryModel.findByIso2(input.iso2);
      
      if (!country) {
        throw new Error(`Country not found: ${input.iso2}`);
      }
      
      return {
        success: true,
        data: country,
      };
    } catch (error) {
      console.error('[getCountryRoute] Error:', error);
      throw error;
    }
  });

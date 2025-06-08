import { publicProcedure } from '../../../create-context';
import { z } from 'zod';

export default publicProcedure
  .input(z.object({
    userId: z.string(),
    country: z.string(),
    visa_type: z.string(),
    entry_date: z.string(),
    duration: z.number(),
    exit_date: z.string(),
    extensions_available: z.number().optional(),
  }))
  .mutation(async ({ input, ctx }) => {
    const { userId, ...visaData } = input;
    
    const { data, error } = await ctx.supabase
      .from('visas')
      .insert({
        user_id: userId,
        ...visaData,
        extensions_available: visaData.extensions_available || 0,
        is_active: true,
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to create visa: ${error.message}`);
    }

    return data;
  });
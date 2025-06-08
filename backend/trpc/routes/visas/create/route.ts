import { publicProcedure } from '../../../trpc';
import { z } from 'zod';

export const createVisaProcedure = publicProcedure
  .input(z.object({
    user_id: z.string(),
    country: z.string(),
    visa_type: z.string(),
    entry_date: z.string(),
    duration: z.number(),
    exit_date: z.string(),
    extensions_available: z.number().optional(),
    is_active: z.boolean().optional(),
  }))
  .mutation(async ({ input, ctx }) => {
    const { data, error } = await ctx.supabase
      .from('visas')
      .insert(input)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to create visa: ${error.message}`);
    }

    return data;
  });
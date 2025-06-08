import { publicProcedure } from '../../../trpc';
import { z } from 'zod';

export const deleteVisaProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const { data, error } = await ctx.supabase
      .from('visas')
      .delete()
      .eq('id', input.id)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to delete visa: ${error.message}`);
    }

    return data;
  });
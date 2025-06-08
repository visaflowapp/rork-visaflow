import { publicProcedure } from '../../../trpc';
import { z } from 'zod';

export const dismissAlertProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const { data, error } = await ctx.supabase
      .from('alerts')
      .delete()
      .eq('id', input.id)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to dismiss alert: ${error.message}`);
    }

    return data;
  });
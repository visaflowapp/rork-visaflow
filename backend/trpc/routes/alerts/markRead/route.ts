import { publicProcedure } from '../../../trpc';
import { z } from 'zod';

export const markAlertReadProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const { data, error } = await ctx.supabase
      .from('alerts')
      .update({ is_read: true })
      .eq('id', input.id)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to mark alert as read: ${error.message}`);
    }

    return data;
  });
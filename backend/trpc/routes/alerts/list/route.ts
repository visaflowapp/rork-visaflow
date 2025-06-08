import { publicProcedure } from '../../../create-context';
import { z } from 'zod';

export default publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input, ctx }) => {
    const { data, error } = await ctx.supabase
      .from('alerts')
      .select('*')
      .eq('user_id', input.userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch alerts: ${error.message}`);
    }

    return data;
  });
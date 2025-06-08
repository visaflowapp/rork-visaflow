import { publicProcedure } from '../../../create-context';
import { z } from 'zod';

export default publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input, ctx }) => {
    const { data, error } = await ctx.supabase
      .from('users')
      .select('*')
      .eq('id', input.userId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }

    return data;
  });
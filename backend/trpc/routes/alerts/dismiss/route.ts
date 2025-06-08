import { publicProcedure } from '../../../create-context';
import { z } from 'zod';

export default publicProcedure
  .input(z.object({ 
    userId: z.string(),
    alertId: z.string() 
  }))
  .mutation(async ({ input, ctx }) => {
    const { data, error } = await ctx.supabase
      .from('alerts')
      .delete()
      .eq('id', input.alertId)
      .eq('user_id', input.userId)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to dismiss alert: ${error.message}`);
    }

    return data;
  });
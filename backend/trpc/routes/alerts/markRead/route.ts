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
      .update({ is_read: true })
      .eq('id', input.alertId)
      .eq('user_id', input.userId)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to mark alert as read: ${error.message}`);
    }

    return data;
  });
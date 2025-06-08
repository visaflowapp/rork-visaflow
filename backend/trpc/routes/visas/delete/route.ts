import { publicProcedure } from '../../../create-context';
import { z } from 'zod';

export default publicProcedure
  .input(z.object({ 
    userId: z.string(),
    visaId: z.string() 
  }))
  .mutation(async ({ input, ctx }) => {
    const { data, error } = await ctx.supabase
      .from('visas')
      .delete()
      .eq('id', input.visaId)
      .eq('user_id', input.userId)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to delete visa: ${error.message}`);
    }

    return data;
  });
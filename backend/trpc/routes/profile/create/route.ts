import { publicProcedure } from '../../../create-context';
import { z } from 'zod';

export default publicProcedure
  .input(z.object({
    id: z.string(),
    name: z.string(),
    nationality: z.string(),
    email: z.string().email(),
    preferred_regions: z.array(z.string()).optional(),
    notifications: z.boolean().optional(),
    travel_mode: z.boolean().optional(),
  }))
  .mutation(async ({ input, ctx }) => {
    const { data, error } = await ctx.supabase
      .from('users')
      .insert(input)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to create profile: ${error.message}`);
    }

    return data;
  });
import { publicProcedure } from '../../../trpc';
import { z } from 'zod';

export const updateProfileProcedure = publicProcedure
  .input(z.object({
    userId: z.string(),
    name: z.string().optional(),
    nationality: z.string().optional(),
    email: z.string().email().optional(),
    preferred_regions: z.array(z.string()).optional(),
    notifications: z.boolean().optional(),
    travel_mode: z.boolean().optional(),
  }))
  .mutation(async ({ input, ctx }) => {
    const { userId, ...updateData } = input;
    
    const { data, error } = await ctx.supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    return data;
  });
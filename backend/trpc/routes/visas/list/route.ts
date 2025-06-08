import { publicProcedure } from '../../../trpc';
import { z } from 'zod';

type Visa = {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  country: string;
  visa_type: string;
  entry_date: string;
  duration: number;
  exit_date: string;
  extensions_available: number;
  is_active: boolean;
};

export const listVisasProcedure = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input, ctx }) => {
    const { data, error } = await ctx.supabase
      .from('visas')
      .select('*')
      .eq('user_id', input.userId)
      .order('exit_date', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch visas: ${error.message}`);
    }

    return data.map((visa: Visa) => ({
      ...visa,
      daysRemaining: Math.max(0, Math.ceil((new Date(visa.exit_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    }));
  });
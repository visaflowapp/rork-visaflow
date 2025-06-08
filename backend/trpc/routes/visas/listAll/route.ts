import { publicProcedure } from '../../../trpc';

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

export const listAllVisasProcedure = publicProcedure
  .query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from('visas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch all visas: ${error.message}`);
    }

    return data.map((visa: Visa) => ({
      ...visa,
      daysRemaining: Math.max(0, Math.ceil((new Date(visa.exit_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    }));
  });
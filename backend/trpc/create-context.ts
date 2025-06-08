import { supabase } from '@/lib/database';

export const createContext = async () => {
  return {
    supabase,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
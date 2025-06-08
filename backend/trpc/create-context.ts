import { initTRPC } from '@trpc/server';
import { supabase } from '@/lib/database';

export const createContext = async () => {
  return {
    supabase,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
import { createClient } from "@supabase/supabase-js";
import { DISABLE_SUPABASE } from "../config";

// Service-role client: bypasses RLS, used only on the server.
// NEVER expose the service role key to the frontend.
export const supabase = !DISABLE_SUPABASE 
  ? createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    )
  : (null as any); // Mock client when disabled

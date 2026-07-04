import { createClient } from "@supabase/supabase-js";

const supabaseStorage = createClient(
  import.meta.env.VITE_SUPABASE_URL_STORAGE,
  import.meta.env.VITE_SUPABASE_ANON_KEY_STORAGE
);

export default supabaseStorage;
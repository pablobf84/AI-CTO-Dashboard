const SUPABASE_URL_KEY = "NEXT_PUBLIC_SUPABASE_URL";
const SUPABASE_ANON_KEY = "NEXT_PUBLIC_SUPABASE_ANON_KEY";

type SupabasePublicEnv = {
  url: string;
  anonKey: string;
};

export function getSupabasePublicEnv(context: "server" | "browser"): SupabasePublicEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const missingKeys = [
    [SUPABASE_URL_KEY, url],
    [SUPABASE_ANON_KEY, anonKey]
  ]
    .filter(([, value]) => typeof value !== "string" || value.trim().length === 0)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    console.error(`[supabase:${context}] Missing environment variables: ${missingKeys.join(", ")}`);
    throw new Error(`Supabase is not configured. Missing: ${missingKeys.join(", ")}.`);
  }

  const supabaseUrl = url as string;
  const supabaseAnonKey = anonKey as string;

  try {
    new URL(supabaseUrl);
  } catch {
    console.error(`[supabase:${context}] Invalid ${SUPABASE_URL_KEY}.`);
    throw new Error(`Supabase is not configured. ${SUPABASE_URL_KEY} must be a valid URL.`);
  }

  return {
    url: supabaseUrl,
    anonKey: supabaseAnonKey
  };
}

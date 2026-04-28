"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getSupabasePublicEnv } from "@/lib/supabase/env";
import type { Database } from "@/types/db";

export function createSupabaseBrowserClient() {
  const { url, anonKey } = getSupabasePublicEnv("browser");

  return createBrowserClient<Database>(url, anonKey);
}

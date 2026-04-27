"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseFormData } from "@/lib/validations/form";
import { loginSchema, registerSchema } from "@/lib/validations/schemas";
import type { ActionState } from "@/types/domain";

export async function registerAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = parseFormData(registerSchema, formData);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the registration fields.",
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password
  });

  if (error) {
    return {
      status: "error",
      message: error.message
    };
  }

  redirect("/app");
}

export async function loginAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = parseFormData(loginSchema, formData);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the login fields.",
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return {
      status: "error",
      message: error.message
    };
  }

  redirect("/app");
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}

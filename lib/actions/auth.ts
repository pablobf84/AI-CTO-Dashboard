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

  const { email, password } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email,
    password
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

  const { email, password } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.log("login error:", error);

    return {
      status: "error",
      message: getLoginErrorMessage(error.message)
    };
  }

  if (!data.session) {
    return {
      status: "error",
      message: "Login succeeded but no session was created. Check Supabase auth settings."
    };
  }

  redirect("/app");
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}

function getLoginErrorMessage(message: string) {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("invalid login credentials")) {
    return "Invalid email or password.";
  }

  if (normalizedMessage.includes("email not confirmed")) {
    return "Confirm your email before logging in.";
  }

  return message || "Login failed. Try again.";
}

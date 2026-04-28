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
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    console.log("register error:", error);

    return {
      status: "error",
      message: getRegisterErrorMessage(error.message)
    };
  }

  if (!data.user) {
    return {
      status: "error",
      message: "Registration did not create a user. Check Supabase auth settings."
    };
  }

  if (!data.session) {
    return {
      status: "success",
      message: "Account created. Confirm your email before logging in."
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

  console.log("LOGIN INPUT:", email, password);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  console.log("LOGIN RESULT:", data);
  console.log("LOGIN ERROR:", error);

  if (error) {
    console.log("login error:", error);

    return {
      status: "error",
      message: getLoginErrorMessage(error.message),
      fieldErrors: {
        email: ["Verify this email belongs to the same Supabase project."],
        password: ["Verify the password matches the Supabase Auth user."]
      }
    };
  }

  if (!data.session) {
    return {
      status: "error",
      message: "Supabase accepted the credentials, but no session was returned. Check cookie handling and auth settings."
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

function getRegisterErrorMessage(message: string) {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("already registered") || normalizedMessage.includes("already exists")) {
    return "An account already exists for this email. Login instead.";
  }

  return message || "Registration failed. Try again.";
}

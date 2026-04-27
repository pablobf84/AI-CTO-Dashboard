"use client";

import { useActionState } from "react";
import { LockKeyhole, Mail } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { loginAction, registerAction } from "@/lib/actions/auth";
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from "@/lib/validations/schemas";
import { initialActionState } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [state, formAction, pending] = useActionState(mode === "login" ? loginAction : registerAction, initialActionState);
  const isRegister = mode === "register";
  const {
    register,
    formState: { errors }
  } = useForm<LoginInput | RegisterInput>({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema)
  });

  return (
    <form action={formAction} className="grid gap-5">
      <FormMessage message={state.message} />

      <label className="grid gap-2">
        <span className="text-sm font-medium">Email</span>
        <span className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input className="pl-10" type="email" autoComplete="email" required {...register("email")} />
        </span>
        <FieldError message={errors.email?.message ?? state.fieldErrors?.email?.[0]} />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium">Password</span>
        <span className="relative">
          <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input className="pl-10" type="password" autoComplete={isRegister ? "new-password" : "current-password"} required {...register("password")} />
        </span>
        <FieldError message={errors.password?.message ?? state.fieldErrors?.password?.[0]} />
      </label>

      <Button type="submit" disabled={pending}>
        {pending ? "Working..." : isRegister ? "Create account" : "Login"}
      </Button>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { Building2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { createOrganizationAction } from "@/lib/actions/organizations";
import { createOrganizationSchema, type CreateOrganizationInput } from "@/lib/validations/schemas";
import { initialActionState } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";

export function CreateOrganizationForm() {
  const [state, formAction, pending] = useActionState(createOrganizationAction, initialActionState);
  const {
    register,
    formState: { errors }
  } = useForm<CreateOrganizationInput>({
    resolver: zodResolver(createOrganizationSchema)
  });

  return (
    <form action={formAction} className="grid gap-5">
      <FormMessage message={state.message} />

      <label className="grid gap-2">
        <span className="text-sm font-medium">Organization name</span>
        <span className="relative">
          <Building2 className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input className="pl-10" placeholder="Acme AI Studio" required {...register("name")} />
        </span>
        <FieldError message={errors.name?.message ?? state.fieldErrors?.name?.[0]} />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium">Slug</span>
        <Input placeholder="acme-ai-studio" required {...register("slug")} />
        <FieldError message={errors.slug?.message ?? state.fieldErrors?.slug?.[0]} />
      </label>

      <Button type="submit" disabled={pending}>
        {pending ? "Creating..." : "Create organization"}
      </Button>
    </form>
  );
}

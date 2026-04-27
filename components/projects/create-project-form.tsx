"use client";

import { useActionState } from "react";
import { FolderPlus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { createProjectAction } from "@/lib/actions/projects";
import { createProjectSchema, type CreateProjectInput } from "@/lib/validations/schemas";
import { initialActionState } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function CreateProjectForm() {
  const [state, formAction, pending] = useActionState(createProjectAction, initialActionState);
  const {
    register,
    formState: { errors }
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema)
  });

  return (
    <form action={formAction} className="grid gap-5">
      <FormMessage message={state.message} />

      <label className="grid gap-2">
        <span className="text-sm font-medium">Project name</span>
        <span className="relative">
          <FolderPlus className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input className="pl-10" placeholder="AI CTO Dashboard" required {...register("name")} />
        </span>
        <FieldError message={errors.name?.message ?? state.fieldErrors?.name?.[0]} />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium">Description</span>
        <Textarea placeholder="What is this SaaS supposed to become?" {...register("description")} />
        <FieldError message={errors.description?.message ?? state.fieldErrors?.description?.[0]} />
      </label>

      <Button type="submit" disabled={pending}>
        {pending ? "Creating..." : "Create project and start intake"}
      </Button>
    </form>
  );
}

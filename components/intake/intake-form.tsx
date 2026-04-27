"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { saveIntakeAction } from "@/lib/actions/intake";
import { intakeSchema, type IntakeInput } from "@/lib/validations/schemas";
import type { IntakeData } from "@/types/domain";
import { initialActionState } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { FormMessage } from "@/components/ui/form-message";
import { Textarea } from "@/components/ui/textarea";

const fields: Array<{ name: keyof IntakeData; label: string; placeholder: string }> = [
  {
    name: "target_audience",
    label: "Target audience",
    placeholder: "Who is the initial customer segment?"
  },
  {
    name: "core_problem",
    label: "Core problem",
    placeholder: "What painful workflow or risk does this product solve?"
  },
  {
    name: "key_features",
    label: "Key features",
    placeholder: "List the core MVP capabilities."
  },
  {
    name: "tech_preferences",
    label: "Tech preferences",
    placeholder: "Preferred stack, constraints or tools."
  },
  {
    name: "integrations_needed",
    label: "Integrations needed",
    placeholder: "External APIs and services needed later."
  }
];

export function IntakeForm({ projectId, defaultValues }: { projectId: string; defaultValues?: Partial<IntakeData> | null }) {
  const [state, formAction, pending] = useActionState(saveIntakeAction, initialActionState);
  const {
    register,
    formState: { errors }
  } = useForm<IntakeInput>({
    resolver: zodResolver(intakeSchema),
    defaultValues: defaultValues ?? undefined
  });

  return (
    <form action={formAction} className="grid gap-5">
      <input type="hidden" name="project_id" value={projectId} />
      <FormMessage message={state.message} />

      {fields.map((field) => (
        <label key={field.name} className="grid gap-2">
          <span className="text-sm font-medium">{field.label}</span>
          <Textarea placeholder={field.placeholder} required {...register(field.name)} />
          <FieldError message={errors[field.name]?.message ?? state.fieldErrors?.[field.name]?.[0]} />
        </label>
      ))}

      <Button type="submit" disabled={pending}>
        <Save size={18} />
        {pending ? "Saving..." : "Save intake brief"}
      </Button>
    </form>
  );
}

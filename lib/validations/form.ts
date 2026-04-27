import type { z } from "zod";

export function parseFormData<TSchema extends z.ZodType>(schema: TSchema, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return schema.safeParse(raw);
}

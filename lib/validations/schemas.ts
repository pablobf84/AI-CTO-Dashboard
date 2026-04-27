import { z } from "zod";

const trimmedText = (field: string, min = 1, max = 2000) =>
  z
    .string({ error: `${field} is required` })
    .trim()
    .min(min, `${field} is required`)
    .max(max, `${field} is too long`);

export const emailSchema = z.string().trim().email("Use a valid email address").max(254, "Email is too long");

export const passwordSchema = z
  .string()
  .min(10, "Password must be at least 10 characters")
  .max(128, "Password is too long")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/[0-9]/, "Password must include a number");

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required").max(128, "Password is too long")
});

export const createOrganizationSchema = z.object({
  name: trimmedText("Organization name", 2, 120),
  slug: z
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters")
    .max(60, "Slug is too long")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and single hyphens")
});

export const createProjectSchema = z.object({
  name: trimmedText("Project name", 2, 140),
  description: z.string().trim().max(1000, "Description is too long").optional().or(z.literal(""))
});

export const intakeSchema = z.object({
  target_audience: trimmedText("Target audience", 3, 2000),
  core_problem: trimmedText("Core problem", 3, 2000),
  key_features: trimmedText("Key features", 3, 3000),
  tech_preferences: trimmedText("Tech preferences", 2, 2000),
  integrations_needed: trimmedText("Integrations needed", 2, 2000)
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type IntakeInput = z.infer<typeof intakeSchema>;

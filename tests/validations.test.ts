import { describe, expect, it } from "vitest";

import {
  createOrganizationSchema,
  createProjectSchema,
  intakeSchema,
  loginSchema,
  registerSchema
} from "@/lib/validations/schemas";

describe("auth validation", () => {
  it("requires valid email and strong password for registration", () => {
    expect(registerSchema.safeParse({ email: "founder@example.com", password: "SecurePass123" }).success).toBe(true);
    expect(registerSchema.safeParse({ email: "bad", password: "short" }).success).toBe(false);
  });

  it("requires valid login credentials", () => {
    expect(loginSchema.safeParse({ email: "founder@example.com", password: "SecurePass123" }).success).toBe(true);
    expect(loginSchema.safeParse({ email: "", password: "" }).success).toBe(false);
  });
});

describe("organization validation", () => {
  it("accepts normalized slugs and rejects unsafe slugs", () => {
    expect(createOrganizationSchema.safeParse({ name: "AI Studio", slug: "ai-studio" }).success).toBe(true);
    expect(createOrganizationSchema.safeParse({ name: "AI Studio", slug: "../admin" }).success).toBe(false);
  });
});

describe("project validation", () => {
  it("requires a project name and allows an optional useful description", () => {
    expect(createProjectSchema.safeParse({ name: "Launch Copilot", description: "A SaaS planning product." }).success).toBe(true);
    expect(createProjectSchema.safeParse({ name: "", description: "" }).success).toBe(false);
  });
});

describe("intake validation", () => {
  it("requires all Sprint 1 intake fields before a brief can be saved", () => {
    const validIntake = {
      target_audience: "Non technical founders",
      core_problem: "They lose control when coordinating AI agents.",
      key_features: "PRD, architecture, backlog, prompt packs",
      tech_preferences: "Next.js and Supabase",
      integrations_needed: "GitHub later, no Sprint 1 integration"
    };

    expect(intakeSchema.safeParse(validIntake).success).toBe(true);
    expect(intakeSchema.safeParse({ ...validIntake, core_problem: "" }).success).toBe(false);
  });
});

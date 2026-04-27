export type ProjectStatus = "draft" | "intake_ready" | "prd_pending" | "architecture_pending" | "active" | "archived";

export type PhaseStatus = "locked" | "pending" | "in_progress" | "ready_for_approval" | "approved";

export type OrganizationRole = "owner" | "member";

export type IntakeData = {
  target_audience: string;
  core_problem: string;
  key_features: string;
  tech_preferences: string;
  integrations_needed: string;
};

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export const initialActionState: ActionState = {
  status: "idle"
};

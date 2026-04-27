import type { IntakeData, OrganizationRole, PhaseStatus, ProjectStatus } from "@/types/domain";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      organization_members: {
        Row: {
          org_id: string;
          profile_id: string;
          role: OrganizationRole;
          created_at: string;
        };
        Insert: {
          org_id: string;
          profile_id: string;
          role: OrganizationRole;
          created_at?: string;
        };
        Update: {
          role?: OrganizationRole;
        };
        Relationships: [
          {
            foreignKeyName: "organization_members_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "organization_members_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      projects: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          description: string | null;
          status: ProjectStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          name: string;
          description?: string | null;
          status?: ProjectStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          status?: ProjectStatus;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          }
        ];
      };
      project_briefs: {
        Row: {
          id: string;
          project_id: string;
          data: IntakeData;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          data: IntakeData;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          data?: IntakeData;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_briefs_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: true;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      project_phases: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          status: PhaseStatus;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          status?: PhaseStatus;
          order_index: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          status?: PhaseStatus;
          order_index?: number;
        };
        Relationships: [
          {
            foreignKeyName: "project_phases_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      approvals: {
        Row: {
          id: string;
          project_id: string;
          phase_id: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          phase_id?: string | null;
          status: string;
          created_at?: string;
        };
        Update: {
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "approvals_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "approvals_phase_id_fkey";
            columns: ["phase_id"];
            isOneToOne: false;
            referencedRelation: "project_phases";
            referencedColumns: ["id"];
          }
        ];
      };
      decisions: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          rationale: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          rationale: string;
          created_at?: string;
        };
        Update: {
          title?: string;
          rationale?: string;
        };
        Relationships: [
          {
            foreignKeyName: "decisions_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      artifacts: {
        Row: {
          id: string;
          project_id: string;
          kind: string;
          title: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          kind: string;
          title: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          kind?: string;
          title?: string;
          content?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "artifacts_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_organization_with_owner: {
        Args: {
          organization_name: string;
          organization_slug: string;
        };
        Returns: string;
      };
      create_project_with_default_phases: {
        Args: {
          target_org_id: string;
          project_name: string;
          project_description: string | null;
        };
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

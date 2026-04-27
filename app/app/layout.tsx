import { AppSidebar } from "@/components/layout/app-sidebar";
import { getActiveOrganization } from "@/lib/db/queries";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const organization = await getActiveOrganization();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[18rem_1fr]">
      <AppSidebar organizationName={organization?.name ?? "No organization"} />
      <main className="min-w-0 px-6 py-8 lg:px-10">{children}</main>
    </div>
  );
}

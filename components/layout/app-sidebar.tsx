import Link from "next/link";
import { FolderKanban, Home, LogOut, Plus } from "lucide-react";

import { logoutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export function AppSidebar({ organizationName }: { organizationName: string }) {
  return (
    <aside className="flex min-h-screen w-full flex-col border-r border-border bg-card px-4 py-5 lg:w-72">
      <div className="px-2">
        <Link href="/app" className="block text-lg font-semibold">
          AI CTO Dashboard
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">{organizationName}</p>
      </div>

      <nav className="mt-8 grid gap-1">
        <Link className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted" href="/app">
          <Home size={18} />
          Dashboard
        </Link>
        <Link className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted" href="/app/projects">
          <FolderKanban size={18} />
          Projects
        </Link>
        <Link className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted" href="/app/projects/new">
          <Plus size={18} />
          New project
        </Link>
      </nav>

      <form action={logoutAction} className="mt-auto">
        <Button type="submit" variant="ghost" className="w-full justify-start">
          <LogOut size={18} />
          Logout
        </Button>
      </form>
    </aside>
  );
}

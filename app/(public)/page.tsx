import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

const promises = ["PRD", "Architecture", "Backlog", "Prompt packs", "Project memory", "Stage approvals"];

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-8">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-lg font-semibold">
          AI CTO Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Create account</Link>
          </Button>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="mb-5 font-mono text-sm uppercase tracking-[0.18em] text-primary">GitHub-first SaaS planning</p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
            Turn a SaaS idea into controlled execution.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Build a durable project memory, technical plan and agent-ready backlog before multiple AIs start writing code.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/register">
                Start Sprint 1 flow <ArrowRight size={18} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/login">I already have an account</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="border-b border-border pb-4">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Project operating system</p>
            <h2 className="mt-2 text-2xl font-semibold">Sprint 1 foundation</h2>
          </div>
          <div className="grid gap-3 pt-5">
            {promises.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-md border border-border bg-background px-4 py-3">
                <CheckCircle2 className="text-primary" size={18} />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

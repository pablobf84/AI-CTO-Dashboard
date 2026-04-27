export function FormMessage({ message, tone = "error" }: { message?: string; tone?: "error" | "success" }) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={
        tone === "success"
          ? "rounded-md border border-primary/25 bg-primary/10 px-4 py-3 text-sm text-primary"
          : "rounded-md border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive"
      }
    >
      {message}
    </div>
  );
}

import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/finance/dashboard")({
  beforeLoad: () => { throw redirect({ to: "/finance" }); },
});

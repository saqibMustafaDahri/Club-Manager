import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/guardian/dashboard")({
  beforeLoad: () => { throw redirect({ to: "/guardian" }); },
});

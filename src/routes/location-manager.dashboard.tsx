import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/location-manager/dashboard")({
  beforeLoad: () => { throw redirect({ to: "/location-manager" }); },
});

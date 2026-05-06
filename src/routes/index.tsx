import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Building2, CreditCard, GitBranch, MessageSquare, BarChart3, Lock, ArrowRight, Check,
} from "lucide-react";
import { PORTALS } from "@/data/portals";
import logoUrl from "@/assets/neomora-logo.png";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Neomora Club Manager — The Complete Academy Management Platform" },
      { name: "description", content: "Manage participants, sessions, fees, and communications for your sports academy in one platform." },
      { property: "og:title", content: "Neomora Club Manager" },
      { property: "og:description", content: "The complete academy management platform." },
    ],
  }),
  component: LandingPage,
});

const features = [
  { icon: Building2, title: "Multi-Location Management", desc: "Run every academy site from one console with location-aware data." },
  { icon: CreditCard, title: "Smart Fee Collection", desc: "Automated invoices, payment reminders and reconciliation." },
  { icon: GitBranch, title: "Participant Lifecycle", desc: "Track enquiries, trials, enrolment, holds, and graduations." },
  { icon: MessageSquare, title: "WhatsApp & Email Automation", desc: "Reach guardians where they actually read messages." },
  { icon: BarChart3, title: "Real-Time Reporting", desc: "Revenue, retention, and capacity dashboards updated live." },
  { icon: Lock, title: "Role-Based Access", desc: "Granular permissions for every staff role and location." },
];

const stats = [
  { value: "500+", label: "Academies" },
  { value: "50,000+", label: "Participants" },
  { value: "3", label: "Countries" },
  { value: "99.9%", label: "Uptime" },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden text-white">
        <img
          src={heroBg}
          alt="Academy training session at golden hour"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-brand/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand/30 via-brand/40 to-brand/70" />
        <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-16 text-center md:pb-32 md:pt-24">
          <div className="mb-10 flex items-center justify-center gap-3">
            <img src={logoUrl} alt="Neomora" className="h-8 w-auto brightness-0 invert" />
            <span className="text-sm font-semibold text-white/80">Club Manager</span>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/90 backdrop-blur">
            <Check className="h-3.5 w-3.5" /> Trusted by 500+ academies
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            The Complete Academy
            <br />
            <span className="text-white/80">Management Platform</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
            Manage participants, sessions, fees, and communications — all in one place.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-white text-brand hover:bg-white/90">
              <Link to="/login">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white bg-transparent text-white hover:bg-white hover:text-brand">
              <Link to="/login">View Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">Features</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Everything you need to run a modern academy</h2>
          <p className="mt-4 text-base text-muted-foreground">
            From your first enquiry to your hundredth invoice — Neomora handles the operations so your coaches can coach.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group rounded-xl border bg-card p-6 transition-shadow hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Portals */}
      <section id="portals" className="bg-secondary/40 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand">Portals</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">A purpose-built portal for every role</h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {PORTALS.map((p) => (
              <div key={p.key} className="flex flex-col rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand text-white">
                  <p.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{p.name}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.description}</p>
                <Button asChild variant="outline" size="sm" className="mt-5">
                  <Link to="/login" search={{ role: p.key }}>Access Portal <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="Neomora" className="h-5 w-auto" />
            <span>© {new Date().getFullYear()} Neomora Club Manager. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

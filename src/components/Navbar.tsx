"use client";

export default function Navbar() {
  return (
    <header className="w-full border-b border-border bg-background">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a
          href="#"
          className="text-sm font-semibold tracking-tight text-foreground">
          KillSub -{" "}
          <span className="text-muted text-xs">
            the last subscription killer
          </span>
        </a>
        <a
          href="#waitlist"
          className="inline-flex items-center justify-center h-8 px-5 rounded-md bg-gradient-to-r from-primary to-transparent text-on-primary text-sm font-semibold hover:bg-primary/8 hover:border-[0.5px] hover:border border-neutral-800 transition duration-900 hover:backdrop-blur-sm"
          onClick={() => {
            if (typeof window !== "undefined" && window.gtag) {
              window.gtag("event", "cta_click", { location: "navbar" });
            }
          }}>
          Join Waitlist
        </a>
      </nav>
    </header>
  );
}

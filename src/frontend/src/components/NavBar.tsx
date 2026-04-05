import { motion } from "motion/react";
import type { View } from "../types/game";

interface NavBarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  coins: number;
  teamName: string;
}

const NAV_LINKS: { label: string; view: View }[] = [
  { label: "HOME", view: "home" },
  { label: "SQUAD", view: "squad" },
  { label: "RECRUIT", view: "recruit" },
  { label: "MATCHES", view: "matches" },
  { label: "STANDINGS", view: "standings" },
];

export function NavBar({
  currentView,
  onNavigate,
  coins,
  teamName,
}: NavBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className="border-b border-border/60"
        style={{
          background: "oklch(0.11 0.02 195 / 0.95)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          {/* Logo */}
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="flex items-center gap-3 group"
            data-ocid="nav.home.link"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-xl"
              style={{
                background: "oklch(0.82 0.19 145 / 0.2)",
                border: "1px solid oklch(0.82 0.19 145 / 0.4)",
              }}
            >
              ⚽
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg text-primary tracking-wider">
                STRIKE
              </span>
              <span className="font-display text-xs text-muted-foreground tracking-widest">
                LEAGUE
              </span>
            </div>
          </button>

          {/* Nav links */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map(({ label, view }) => (
              <button
                type="button"
                key={view}
                onClick={() => onNavigate(view)}
                className={`relative px-3 py-2 font-display text-sm tracking-widest transition-colors ${
                  currentView === view
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid={`nav.${view}.link`}
              >
                {label}
                {currentView === view && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Right: coins + CTA */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/60 bg-card">
              <span className="text-yellow-400 text-sm">🪙</span>
              <span className="font-display text-sm text-foreground tracking-wider">
                {coins.toLocaleString()}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted">
              <span className="text-primary text-xs">⚡</span>
              <span className="font-display text-xs text-muted-foreground tracking-wide">
                {teamName}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("matches")}
              className="font-display text-sm tracking-widest px-4 py-2 rounded-lg transition-all hover:shadow-glow active:scale-95"
              style={{
                background: "oklch(0.82 0.19 145)",
                color: "oklch(0.1 0.02 145)",
              }}
              data-ocid="nav.play_now.button"
            >
              PLAY NOW
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex overflow-x-auto gap-1 px-4 pb-2 scrollbar-none">
          {NAV_LINKS.map(({ label, view }) => (
            <button
              type="button"
              key={view}
              onClick={() => onNavigate(view)}
              className={`shrink-0 px-3 py-1.5 font-display text-xs tracking-widest rounded-md transition-colors ${
                currentView === view
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground"
              }`}
              data-ocid={`nav.mobile.${view}.link`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

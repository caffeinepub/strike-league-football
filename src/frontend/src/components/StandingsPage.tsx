import { motion } from "motion/react";
import type { TeamStanding } from "../types/game";

interface StandingsPageProps {
  standings: TeamStanding[];
  teamName: string;
}

export function StandingsPage({ standings, teamName }: StandingsPageProps) {
  const sortedStandings = [...standings].sort((a, b) => b.points - a.points);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-5xl text-foreground mb-2">
          STANDINGS
        </h1>
        <p className="text-muted-foreground font-display text-sm tracking-wider">
          STRIKE PREMIER LEAGUE — SEASON 2025/26
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border/60 overflow-hidden card-glow"
        style={{ background: "oklch(0.17 0.02 195)" }}
      >
        {/* Table header */}
        <div
          className="px-4 py-3 grid gap-2 border-b border-border/60"
          style={{
            background: "oklch(0.13 0.025 195)",
            gridTemplateColumns:
              "2rem 1fr 2.5rem 2.5rem 2.5rem 2.5rem 2.5rem 2.5rem 2.5rem 3rem",
          }}
        >
          <div className="font-display text-xs text-muted-foreground tracking-widest text-center">
            #
          </div>
          <div className="font-display text-xs text-muted-foreground tracking-widest">
            CLUB
          </div>
          <div className="font-display text-xs text-muted-foreground tracking-widest text-center">
            P
          </div>
          <div className="font-display text-xs text-muted-foreground tracking-widest text-center">
            W
          </div>
          <div className="font-display text-xs text-muted-foreground tracking-widest text-center">
            D
          </div>
          <div className="font-display text-xs text-muted-foreground tracking-widest text-center">
            L
          </div>
          <div className="font-display text-xs text-muted-foreground tracking-widest text-center hidden sm:block">
            GF
          </div>
          <div className="font-display text-xs text-muted-foreground tracking-widest text-center hidden sm:block">
            GA
          </div>
          <div className="font-display text-xs text-muted-foreground tracking-widest text-center">
            GD
          </div>
          <div className="font-display text-xs text-primary tracking-widest text-center">
            PTS
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-border/30">
          {sortedStandings.map((team, idx) => (
            <motion.div
              key={team.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04 }}
              className={`px-4 py-3 grid gap-2 items-center transition-colors ${
                team.isUser
                  ? "border-l-2 border-primary bg-primary/5"
                  : "hover:bg-secondary/30"
              }`}
              style={{
                gridTemplateColumns:
                  "2rem 1fr 2.5rem 2.5rem 2.5rem 2.5rem 2.5rem 2.5rem 2.5rem 3rem",
              }}
              data-ocid={`standings.item.${idx + 1}`}
            >
              {/* Position */}
              <div
                className={`font-display text-sm text-center ${
                  idx === 0
                    ? "text-yellow-400"
                    : idx === 1
                      ? "text-gray-300"
                      : idx === 2
                        ? "text-amber-600"
                        : team.isUser
                          ? "text-primary"
                          : "text-muted-foreground"
                }`}
              >
                {idx + 1}
              </div>

              {/* Club */}
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0"
                  style={{
                    background: team.isUser
                      ? "oklch(0.82 0.19 145 / 0.2)"
                      : "oklch(0.22 0.025 195)",
                  }}
                >
                  {team.isUser ? "⚡" : team.name[0]}
                </div>
                <span
                  className={`font-display text-sm tracking-wide truncate ${
                    team.isUser ? "text-primary" : "text-foreground"
                  }`}
                >
                  {team.name}
                  {team.isUser && " ← YOU"}
                </span>
              </div>

              <div className="font-display text-sm text-muted-foreground text-center">
                {team.played}
              </div>
              <div className="font-display text-sm text-foreground text-center">
                {team.won}
              </div>
              <div className="font-display text-sm text-foreground text-center">
                {team.drawn}
              </div>
              <div className="font-display text-sm text-foreground text-center">
                {team.lost}
              </div>
              <div className="font-display text-sm text-muted-foreground text-center hidden sm:block">
                {team.gf}
              </div>
              <div className="font-display text-sm text-muted-foreground text-center hidden sm:block">
                {team.ga}
              </div>
              <div
                className={`font-display text-sm text-center ${team.gf - team.ga >= 0 ? "text-primary" : "text-destructive"}`}
              >
                {team.gf - team.ga > 0 ? "+" : ""}
                {team.gf - team.ga}
              </div>
              <div
                className="font-display text-base text-center font-bold"
                style={{
                  color: team.isUser
                    ? "oklch(0.82 0.19 145)"
                    : "oklch(0.97 0 0)",
                }}
              >
                {team.points}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-xs text-muted-foreground font-display tracking-wide">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <span>CHAMPION</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span>YOUR TEAM — {teamName}</span>
        </div>
      </div>
    </main>
  );
}

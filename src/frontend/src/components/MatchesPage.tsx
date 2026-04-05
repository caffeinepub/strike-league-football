import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import type { GameState, MatchResult } from "../types/game";

interface MatchesPageProps {
  state: GameState;
  onSimulate: () => MatchResult | null;
  onPlayMatch: () => void;
}

export function MatchesPage({
  state,
  onSimulate,
  onPlayMatch,
}: MatchesPageProps) {
  const [latestResult, setLatestResult] = useState<MatchResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const lineup = state.players.filter((p) => p.inLineup);
  const avgRating =
    lineup.length > 0
      ? Math.round(lineup.reduce((s, p) => s + p.rating, 0) / lineup.length)
      : 0;

  const handleSimulate = useCallback(() => {
    if (lineup.length < 11) return;
    setIsSimulating(true);
    setLatestResult(null);
    setTimeout(() => {
      const result = onSimulate();
      setLatestResult(result);
      setIsSimulating(false);
    }, 1200);
  }, [lineup.length, onSimulate]);

  const resultColor = (r: "W" | "D" | "L") =>
    r === "W"
      ? "oklch(0.82 0.19 145)"
      : r === "D"
        ? "oklch(0.82 0.19 80)"
        : "oklch(0.65 0.22 25)";

  const resultBg = (r: "W" | "D" | "L") =>
    r === "W"
      ? "oklch(0.82 0.19 145 / 0.15)"
      : r === "D"
        ? "oklch(0.82 0.19 80 / 0.15)"
        : "oklch(0.65 0.22 25 / 0.15)";

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-5xl text-foreground mb-2">MATCHDAY</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border/60 bg-card">
            <span className="text-yellow-400">🪙</span>
            <span className="font-display text-lg tracking-wider">
              {state.coins.toLocaleString()} COINS
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border/60 bg-card">
            <span className="text-primary">⭐</span>
            <span className="font-display text-sm tracking-wider">
              TEAM RATING: {avgRating}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Play match */}
        <div>
          {/* Lineup check */}
          <div
            className="rounded-2xl border border-border/60 p-6 mb-6 card-glow"
            style={{ background: "oklch(0.17 0.02 195)" }}
          >
            <h2 className="font-display text-2xl text-foreground mb-4">
              LINEUP
            </h2>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {["GK", "DEF", "MID", "FWD"].map((pos) => {
                const count = lineup.filter((p) => p.position === pos).length;
                return (
                  <div key={pos} className="text-center">
                    <div className="font-display text-2xl text-foreground">
                      {count}
                    </div>
                    <div className="font-display text-xs text-muted-foreground tracking-widest">
                      {pos}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${(lineup.length / 11) * 100}%` }}
                />
              </div>
              <span className="font-display text-sm text-muted-foreground">
                {lineup.length}/11
              </span>
            </div>

            {lineup.length < 11 && (
              <div
                className="text-yellow-400 font-display text-xs tracking-wide py-2"
                data-ocid="matches.lineup_warning"
              >
                ⚠ NEED {11 - lineup.length} MORE PLAYERS IN LINEUP
              </div>
            )}
          </div>

          {/* Play buttons */}
          <div className="flex flex-col gap-3">
            {/* Playable match button */}
            <button
              type="button"
              onClick={onPlayMatch}
              disabled={lineup.length < 11}
              className={`w-full py-6 rounded-2xl font-display text-3xl tracking-widest transition-all ${
                lineup.length >= 11
                  ? "hover:shadow-glow-lg active:scale-98"
                  : "opacity-40 cursor-not-allowed"
              }`}
              style={{
                background:
                  lineup.length >= 11
                    ? "oklch(0.82 0.19 145)"
                    : "oklch(0.22 0.025 195)",
                color:
                  lineup.length >= 11
                    ? "oklch(0.1 0.02 145)"
                    : "oklch(0.73 0.015 200)",
              }}
              data-ocid="matches.play.button"
            >
              🕹 PLAY MATCH
            </button>

            {/* Simulate button */}
            <button
              type="button"
              onClick={handleSimulate}
              disabled={lineup.length < 11 || isSimulating}
              className={`w-full py-3 rounded-xl font-display text-base tracking-widest border transition-all ${
                lineup.length >= 11 && !isSimulating
                  ? "border-border/60 bg-card hover:bg-secondary"
                  : "opacity-40 cursor-not-allowed border-border/40 bg-card"
              }`}
              data-ocid="matches.simulate.button"
            >
              {isSimulating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block animate-spin">⚽</span>
                  SIMULATING...
                </span>
              ) : (
                "⚡ SIMULATE MATCH"
              )}
            </button>
          </div>

          {/* Latest result */}
          <AnimatePresence>
            {latestResult && !isSimulating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                className="mt-6 rounded-2xl border overflow-hidden"
                style={{
                  borderColor: resultColor(latestResult.result),
                  background: resultBg(latestResult.result),
                }}
                data-ocid="matches.result.card"
              >
                <div
                  className="px-5 py-3 flex items-center justify-between border-b"
                  style={{
                    borderColor: `${resultColor(latestResult.result)}40`,
                  }}
                >
                  <span className="font-display text-xs tracking-[0.3em] text-muted-foreground">
                    FULL TIME
                  </span>
                  <span
                    className="font-display text-sm tracking-widest px-3 py-1 rounded-full"
                    style={{
                      color: resultColor(latestResult.result),
                      background: `${resultColor(latestResult.result)}20`,
                    }}
                  >
                    {latestResult.result === "W"
                      ? "VICTORY"
                      : latestResult.result === "D"
                        ? "DRAW"
                        : "DEFEAT"}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center flex-1">
                      <div className="font-display text-base tracking-wide text-foreground mb-1">
                        {state.teamName}
                      </div>
                      <div
                        className="font-display text-5xl"
                        style={{ color: resultColor(latestResult.result) }}
                      >
                        {latestResult.goalsFor}
                      </div>
                    </div>
                    <div className="font-display text-2xl text-muted-foreground px-4">
                      VS
                    </div>
                    <div className="text-center flex-1">
                      <div className="font-display text-base tracking-wide text-foreground mb-1">
                        {latestResult.opponent}
                      </div>
                      <div className="font-display text-5xl text-foreground">
                        {latestResult.goalsAgainst}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-yellow-400">🪙</span>
                    <span
                      className="font-display text-lg tracking-wider"
                      style={{ color: resultColor(latestResult.result) }}
                    >
                      +{latestResult.coinsEarned.toLocaleString()} COINS EARNED
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Match history */}
        <div>
          <h2 className="font-display text-2xl text-foreground mb-4">
            MATCH HISTORY
          </h2>
          {state.matchHistory.length === 0 ? (
            <div
              className="rounded-2xl border border-border/60 p-8 text-center"
              style={{ background: "oklch(0.17 0.02 195)" }}
              data-ocid="matches.history.empty_state"
            >
              <div className="text-4xl mb-3">📋</div>
              <div className="font-display text-xl text-muted-foreground">
                NO MATCHES PLAYED YET
              </div>
              <div className="text-muted-foreground text-sm mt-1">
                Play your first match to see history
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {state.matchHistory.map((match, idx) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-xl border border-border/60 p-4 flex items-center gap-4"
                  style={{ background: "oklch(0.17 0.02 195)" }}
                  data-ocid={`matches.history.item.${idx + 1}`}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-display text-sm shrink-0"
                    style={{
                      background: resultBg(match.result),
                      color: resultColor(match.result),
                      border: `1px solid ${resultColor(match.result)}40`,
                    }}
                  >
                    {match.result}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-sm tracking-wide text-foreground truncate">
                      {state.teamName} vs {match.opponent}
                    </div>
                    <div className="font-display text-xs text-muted-foreground tracking-wider">
                      {match.date}
                    </div>
                  </div>
                  <div className="font-display text-xl tracking-wider text-foreground shrink-0">
                    {match.goalsFor}–{match.goalsAgainst}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-yellow-400 text-xs">🪙</span>
                    <span className="font-display text-xs tracking-wide text-muted-foreground">
                      +{match.coinsEarned}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

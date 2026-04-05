import { motion } from "motion/react";
import type { Player } from "../types/game";

interface SquadPageProps {
  players: Player[];
  coins: number;
  onToggleLineup: (id: number) => void;
}

const POSITION_STYLES: Record<string, string> = {
  GK: "position-gk",
  DEF: "position-def",
  MID: "position-mid",
  FWD: "position-fwd",
};

export function SquadPage({ players, coins, onToggleLineup }: SquadPageProps) {
  const ownedPlayers = players.filter((p) => p.owned);
  const lineup = ownedPlayers.filter((p) => p.inLineup);
  const lineupCount = lineup.length;

  const posCount = (pos: string) =>
    lineup.filter((p) => p.position === pos).length;
  const maxByPos: Record<string, number> = { GK: 1, DEF: 4, MID: 4, FWD: 4 };

  const canAdd = (player: Player) => {
    if (player.inLineup) return true;
    if (lineupCount >= 11) return false;
    return posCount(player.position) < maxByPos[player.position];
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-5xl text-foreground mb-2">MY SQUAD</h1>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border/60 bg-card">
            <span className="text-yellow-400">🪙</span>
            <span className="font-display text-lg tracking-wider">
              {coins.toLocaleString()} COINS
            </span>
          </div>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-display tracking-wider text-sm ${
              lineupCount === 11
                ? "border-primary/60 bg-primary/10 text-primary"
                : "border-border/60 bg-card text-muted-foreground"
            }`}
          >
            👥 LINEUP: {lineupCount}/11
          </div>
          {["GK", "DEF", "MID", "FWD"].map((pos) => (
            <div
              key={pos}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary"
            >
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-display tracking-wide ${POSITION_STYLES[pos]}`}
              >
                {pos}
              </span>
              <span className="font-display text-sm text-muted-foreground">
                {posCount(pos)}/{maxByPos[pos]}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {lineupCount < 11 && (
        <div
          className="mb-6 px-4 py-3 rounded-lg border border-yellow-500/30 bg-yellow-500/5 text-yellow-400 text-sm font-display tracking-wide"
          data-ocid="squad.lineup_warning"
        >
          ⚠ ADD {11 - lineupCount} MORE PLAYER
          {11 - lineupCount !== 1 ? "S" : ""} TO YOUR LINEUP BEFORE PLAYING
        </div>
      )}

      {/* Player grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {ownedPlayers.map((player, idx) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            data-ocid={`squad.item.${idx + 1}`}
          >
            <PlayerCard
              player={player}
              canAdd={canAdd(player)}
              onToggle={() => onToggleLineup(player.id)}
            />
          </motion.div>
        ))}
      </div>

      {ownedPlayers.length === 0 && (
        <div
          className="text-center py-20 text-muted-foreground"
          data-ocid="squad.empty_state"
        >
          <div className="text-5xl mb-4">👥</div>
          <div className="font-display text-2xl">NO PLAYERS FOUND</div>
        </div>
      )}
    </main>
  );
}

function PlayerCard({
  player,
  canAdd,
  onToggle,
}: {
  player: Player;
  canAdd: boolean;
  onToggle: () => void;
}) {
  const ratingColor =
    player.rating >= 85
      ? "oklch(0.82 0.19 145)"
      : player.rating >= 75
        ? "oklch(0.82 0.19 80)"
        : player.rating >= 65
          ? "oklch(0.75 0.15 60)"
          : "oklch(0.73 0.015 200)";

  return (
    <div
      className={`relative rounded-xl border overflow-hidden transition-all ${
        player.inLineup
          ? "border-primary/60 shadow-glow"
          : "border-border/60 hover:border-border"
      }`}
      style={{ background: "oklch(0.17 0.02 195)" }}
    >
      {/* Rating circle */}
      <div className="absolute top-3 right-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-display text-sm border-2"
          style={{
            borderColor: ratingColor,
            color: ratingColor,
            background: "oklch(0.13 0.025 195 / 0.8)",
          }}
        >
          {player.rating}
        </div>
      </div>

      <div className="p-4">
        {/* Position badge */}
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-display tracking-wide ${POSITION_STYLES[player.position]}`}
        >
          {player.position}
        </span>

        {/* Shirt number area */}
        <div className="my-3 flex items-center justify-center">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
            style={{ background: "oklch(0.22 0.025 195)" }}
          >
            {player.position === "GK"
              ? "🧤"
              : player.position === "DEF"
                ? "🛡️"
                : player.position === "MID"
                  ? "⚡"
                  : "⚽"}
          </div>
        </div>

        {/* Name */}
        <div className="font-display text-base tracking-wide text-foreground leading-tight mb-1">
          {player.name}
        </div>

        {/* In lineup badge */}
        {player.inLineup && (
          <div className="mb-2">
            <span className="text-xs font-display tracking-widest px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/40">
              IN LINEUP
            </span>
          </div>
        )}

        {/* Toggle button */}
        <button
          type="button"
          onClick={onToggle}
          disabled={!player.inLineup && !canAdd}
          className={`w-full mt-2 py-1.5 rounded-lg font-display text-xs tracking-widest transition-all ${
            player.inLineup
              ? "bg-destructive/20 text-destructive border border-destructive/40 hover:bg-destructive/30"
              : canAdd
                ? "bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30"
                : "bg-secondary/50 text-muted-foreground cursor-not-allowed opacity-50"
          }`}
          data-ocid={`squad.toggle.${player.id}`}
        >
          {player.inLineup
            ? "REMOVE"
            : canAdd
              ? "ADD TO LINEUP"
              : "LIMIT REACHED"}
        </button>
      </div>
    </div>
  );
}

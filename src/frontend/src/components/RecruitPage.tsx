import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Player, Position } from "../types/game";

interface RecruitPageProps {
  players: Player[];
  coins: number;
  onRecruit: (id: number) => void;
}

const POSITION_STYLES: Record<string, string> = {
  GK: "position-gk",
  DEF: "position-def",
  MID: "position-mid",
  FWD: "position-fwd",
};

const ALL_POSITIONS: (Position | "ALL")[] = ["ALL", "GK", "DEF", "MID", "FWD"];

export function RecruitPage({ players, coins, onRecruit }: RecruitPageProps) {
  const [filter, setFilter] = useState<Position | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const available = players.filter((p) => !p.owned);
  const filtered = available.filter((p) => {
    const matchPos = filter === "ALL" || p.position === filter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchPos && matchSearch;
  });

  const handleRecruit = (player: Player) => {
    if (coins < player.price) {
      toast.error(
        `Need ${(player.price - coins).toLocaleString()} more coins to sign ${player.name}`,
      );
      return;
    }
    onRecruit(player.id);
    toast.success(
      `${player.name} signed! -${player.price.toLocaleString()} coins`,
    );
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-5xl text-foreground mb-2">
          RECRUIT PLAYERS
        </h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border/60 bg-card">
            <span className="text-yellow-400">🪙</span>
            <span className="font-display text-lg tracking-wider">
              {coins.toLocaleString()} COINS
            </span>
          </div>
          <div className="text-muted-foreground font-display text-sm tracking-wide">
            {available.length} PLAYERS AVAILABLE
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search players..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg bg-card border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 w-56"
          data-ocid="recruit.search_input"
        />
        <div className="flex gap-2">
          {ALL_POSITIONS.map((pos) => (
            <button
              type="button"
              key={pos}
              onClick={() => setFilter(pos)}
              className={`px-3 py-2 rounded-lg font-display text-xs tracking-widest transition-colors ${
                filter === pos
                  ? "bg-primary/20 text-primary border border-primary/40"
                  : "bg-card border border-border/60 text-muted-foreground hover:text-foreground"
              }`}
              data-ocid={`recruit.filter.${pos.toLowerCase()}.tab`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      {/* Player grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((player, idx) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.04 }}
              data-ocid={`recruit.item.${idx + 1}`}
            >
              <RecruitCard
                player={player}
                coins={coins}
                onRecruit={() => handleRecruit(player)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div
          className="text-center py-20 text-muted-foreground"
          data-ocid="recruit.empty_state"
        >
          <div className="text-5xl mb-4">🔍</div>
          <div className="font-display text-2xl mb-2">NO PLAYERS FOUND</div>
          <div className="text-sm">Try adjusting your filters</div>
        </div>
      )}
    </main>
  );
}

function RecruitCard({
  player,
  coins,
  onRecruit,
}: {
  player: Player;
  coins: number;
  onRecruit: () => void;
}) {
  const canAfford = coins >= player.price;
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
      className="rounded-xl border border-border/60 overflow-hidden transition-all hover:border-border card-glow"
      style={{ background: "oklch(0.17 0.02 195)" }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-display tracking-wide ${POSITION_STYLES[player.position]}`}
          >
            {player.position}
          </span>
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

        <div className="flex items-center justify-center my-3">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center text-4xl"
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

        <div className="font-display text-base tracking-wide text-foreground mb-1">
          {player.name}
        </div>

        {/* Rating bar */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${player.rating}%`, background: ratingColor }}
            />
          </div>
          <span className="text-xs text-muted-foreground font-display">
            {player.rating}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400 text-sm">🪙</span>
            <span className="font-display text-sm tracking-wide text-foreground">
              {player.price.toLocaleString()}
            </span>
          </div>
          <button
            type="button"
            onClick={onRecruit}
            className={`font-display text-xs tracking-widest px-3 py-1.5 rounded-lg transition-all ${
              canAfford
                ? "hover:shadow-glow active:scale-95"
                : "opacity-50 cursor-not-allowed"
            }`}
            style={{
              background: canAfford
                ? "oklch(0.82 0.19 145)"
                : "oklch(0.22 0.025 195)",
              color: canAfford
                ? "oklch(0.1 0.02 145)"
                : "oklch(0.73 0.015 200)",
            }}
            data-ocid={`recruit.sign.${player.id}.button`}
          >
            {canAfford ? "SIGN" : "NEED COINS"}
          </button>
        </div>
      </div>
    </div>
  );
}

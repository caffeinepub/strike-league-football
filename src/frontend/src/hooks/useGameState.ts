import { useCallback, useEffect, useState } from "react";
import { AI_TEAM_NAMES, createInitialState } from "../data/initialState";
import type {
  GameState,
  MatchResult,
  Player,
  TeamStanding,
} from "../types/game";

const STORAGE_KEY = "strikeLeague_gameState";

function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as GameState;
  } catch {
    // ignore
  }
  return createInitialState();
}

export function useGameState() {
  const [state, setState] = useState<GameState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const toggleLineup = useCallback((playerId: number) => {
    setState((prev) => {
      const player = prev.players.find((p) => p.id === playerId);
      if (!player || !player.owned) return prev;

      const lineup = prev.players.filter((p) => p.inLineup);
      const isIn = player.inLineup;

      if (!isIn) {
        if (lineup.length >= 11) return prev;
        const posCount = lineup.filter(
          (p) => p.position === player.position,
        ).length;
        const maxByPos: Record<string, number> = {
          GK: 1,
          DEF: 4,
          MID: 4,
          FWD: 4,
        };
        if (posCount >= maxByPos[player.position]) return prev;
      }

      return {
        ...prev,
        players: prev.players.map((p) =>
          p.id === playerId ? { ...p, inLineup: !p.inLineup } : p,
        ),
      };
    });
  }, []);

  const recruitPlayer = useCallback((playerId: number) => {
    setState((prev) => {
      const player = prev.players.find((p) => p.id === playerId);
      if (!player || player.owned || prev.coins < player.price) return prev;
      return {
        ...prev,
        coins: prev.coins - player.price,
        players: prev.players.map((p) =>
          p.id === playerId ? { ...p, owned: true } : p,
        ),
      };
    });
  }, []);

  const applyMatchResult = useCallback(
    (prev: GameState, matchResult: MatchResult): GameState => {
      const {
        goalsFor: gf,
        goalsAgainst: ga,
        result: outcome,
        coinsEarned,
        opponent: opponentName,
      } = matchResult;

      const updatedStandings = prev.standings.map((team): TeamStanding => {
        if (team.isUser) {
          return {
            ...team,
            played: team.played + 1,
            won: team.won + (outcome === "W" ? 1 : 0),
            drawn: team.drawn + (outcome === "D" ? 1 : 0),
            lost: team.lost + (outcome === "L" ? 1 : 0),
            gf: team.gf + gf,
            ga: team.ga + ga,
            points:
              team.points + (outcome === "W" ? 3 : outcome === "D" ? 1 : 0),
          };
        }
        if (team.name === opponentName) {
          const aiOutcome = outcome === "W" ? "L" : outcome === "L" ? "W" : "D";
          return {
            ...team,
            played: team.played + 1,
            won: team.won + (aiOutcome === "W" ? 1 : 0),
            drawn: team.drawn + (aiOutcome === "D" ? 1 : 0),
            lost: team.lost + (aiOutcome === "L" ? 1 : 0),
            gf: team.gf + ga,
            ga: team.ga + gf,
            points:
              team.points + (aiOutcome === "W" ? 3 : aiOutcome === "D" ? 1 : 0),
          };
        }
        return team;
      });

      return {
        ...prev,
        coins: prev.coins + coinsEarned,
        matchHistory: [matchResult, ...prev.matchHistory].slice(0, 20),
        standings: updatedStandings.sort((a, b) => b.points - a.points),
      };
    },
    [],
  );

  const simulateMatch = useCallback((): MatchResult | null => {
    let result: MatchResult | null = null;

    setState((prev) => {
      const lineup = prev.players.filter((p) => p.inLineup);
      if (lineup.length < 11) return prev;

      const userAvg = lineup.reduce((s, p) => s + p.rating, 0) / lineup.length;
      const opponentName =
        AI_TEAM_NAMES[Math.floor(Math.random() * AI_TEAM_NAMES.length)];
      const opponentRating = 62 + Math.floor(Math.random() * 20);
      const diff = (userAvg - opponentRating) / 20;

      const baseGoals = () => Math.floor(Math.random() * 4);
      let gf = baseGoals() + (diff > 0 ? Math.floor(diff * 2) : 0);
      let ga = baseGoals() + (diff < 0 ? Math.floor(Math.abs(diff) * 2) : 0);
      gf = Math.max(0, Math.min(9, gf));
      ga = Math.max(0, Math.min(9, ga));

      const outcome: "W" | "D" | "L" = gf > ga ? "W" : gf === ga ? "D" : "L";
      const coinsEarned = outcome === "W" ? 500 : outcome === "D" ? 200 : 100;

      const matchResult: MatchResult = {
        id: Date.now(),
        opponent: opponentName,
        goalsFor: gf,
        goalsAgainst: ga,
        result: outcome,
        coinsEarned,
        date: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      };
      result = matchResult;

      return applyMatchResult(prev, matchResult);
    });

    return result;
  }, [applyMatchResult]);

  const recordMatch = useCallback(
    (matchResult: MatchResult) => {
      setState((prev) => applyMatchResult(prev, matchResult));
    },
    [applyMatchResult],
  );

  const resetGame = useCallback(() => {
    const fresh = createInitialState();
    setState(fresh);
  }, []);

  return {
    state,
    toggleLineup,
    recruitPlayer,
    simulateMatch,
    recordMatch,
    resetGame,
  };
}

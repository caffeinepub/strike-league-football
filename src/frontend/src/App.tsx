import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { HomePage } from "./components/HomePage";
import { MatchesPage } from "./components/MatchesPage";
import { NavBar } from "./components/NavBar";
import { PlayableMatch } from "./components/PlayableMatch";
import { RecruitPage } from "./components/RecruitPage";
import { SquadPage } from "./components/SquadPage";
import { StandingsPage } from "./components/StandingsPage";
import { useGameState } from "./hooks/useGameState";
import type { MatchResult, View } from "./types/game";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("home");
  const {
    state,
    toggleLineup,
    recruitPlayer,
    simulateMatch,
    recordMatch,
    resetGame,
  } = useGameState();

  const handleMatchEnd = (result: MatchResult) => {
    recordMatch(result);
    setCurrentView("matches");
  };

  return (
    <div className="min-h-screen bg-background">
      {currentView !== "game" && (
        <NavBar
          currentView={currentView}
          onNavigate={setCurrentView}
          coins={state.coins}
          teamName={state.teamName}
        />
      )}

      <div
        className={
          currentView !== "home" && currentView !== "game" ? "pt-20" : ""
        }
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {currentView === "home" && (
              <HomePage
                onNavigate={setCurrentView}
                standings={state.standings}
                teamName={state.teamName}
                coins={state.coins}
              />
            )}
            {currentView === "squad" && (
              <SquadPage
                players={state.players}
                coins={state.coins}
                onToggleLineup={toggleLineup}
              />
            )}
            {currentView === "recruit" && (
              <RecruitPage
                players={state.players}
                coins={state.coins}
                onRecruit={recruitPlayer}
              />
            )}
            {currentView === "matches" && (
              <MatchesPage
                state={state}
                onSimulate={simulateMatch}
                onPlayMatch={() => setCurrentView("game")}
              />
            )}
            {currentView === "standings" && (
              <StandingsPage
                standings={state.standings}
                teamName={state.teamName}
              />
            )}
            {currentView === "game" && (
              <PlayableMatch
                state={state}
                onMatchEnd={handleMatchEnd}
                onCancel={() => setCurrentView("matches")}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dev reset button */}
      {currentView !== "game" && (
        <button
          type="button"
          onClick={resetGame}
          className="fixed bottom-4 right-4 px-3 py-1.5 rounded-lg text-xs font-display tracking-wide opacity-20 hover:opacity-60 transition-opacity bg-secondary text-muted-foreground border border-border/40"
          data-ocid="app.reset.button"
        >
          RESET GAME
        </button>
      )}

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "oklch(0.17 0.02 195)",
            border: "1px solid oklch(0.27 0.025 195)",
            color: "oklch(0.97 0 0)",
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: "0.05em",
          },
        }}
      />
    </div>
  );
}

import { useCallback, useEffect, useRef, useState } from "react";
import { AI_TEAM_NAMES } from "../data/initialState";
import type { GameState, MatchResult } from "../types/game";

interface PlayableMatchProps {
  state: GameState;
  onMatchEnd: (result: MatchResult) => void;
  onCancel: () => void;
}

const FIELD_W = 800;
const FIELD_H = 520;
const BALL_R = 8;
const PLAYER_R = 14;
const GOAL_W = 12;
const GOAL_H = 110;
const MATCH_DURATION = 90;

type Vec2 = { x: number; y: number };
type Entity = Vec2 & { vx: number; vy: number };
type AIPlayer = Entity & { targetX: number; targetY: number };

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function dist(a: Vec2, b: Vec2) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function norm(v: Vec2): Vec2 {
  const d = Math.hypot(v.x, v.y) || 1;
  return { x: v.x / d, y: v.y / d };
}

export function PlayableMatch({
  state,
  onMatchEnd,
  onCancel,
}: PlayableMatchProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const rafRef = useRef<number>(0);
  const gameRef = useRef({
    ball: { x: FIELD_W / 2, y: FIELD_H / 2, vx: 0, vy: 0 } as Entity,
    player: { x: FIELD_W / 4, y: FIELD_H / 2, vx: 0, vy: 0 } as Entity,
    aiPlayers: [] as AIPlayer[],
    scoreUser: 0,
    scoreAI: 0,
    elapsed: 0,
    lastTs: 0,
    phase: "kickoff" as "kickoff" | "play" | "goal" | "ended",
    goalTimer: 0,
    kickoffTimer: 1.5,
    possession: "user" as "user" | "ai",
  });

  const opponentNameRef = useRef(
    AI_TEAM_NAMES[Math.floor(Math.random() * AI_TEAM_NAMES.length)],
  );

  const [scoreDisplay, setScoreDisplay] = useState({ user: 0, ai: 0 });
  const [minuteDisplay, setMinuteDisplay] = useState(0);
  const setPhase = useState<"kickoff" | "play" | "goal" | "ended">(
    "kickoff",
  )[1];

  const initAI = useCallback(() => {
    const ai: AIPlayer[] = [];
    ai.push({
      x: FIELD_W - 60,
      y: FIELD_H / 2,
      vx: 0,
      vy: 0,
      targetX: FIELD_W - 60,
      targetY: FIELD_H / 2,
    });
    for (let i = 0; i < 4; i++) {
      ai.push({
        x: FIELD_W - 180,
        y: 80 + i * 90,
        vx: 0,
        vy: 0,
        targetX: FIELD_W - 180,
        targetY: 80 + i * 90,
      });
    }
    for (let i = 0; i < 3; i++) {
      ai.push({
        x: FIELD_W - 310,
        y: 130 + i * 110,
        vx: 0,
        vy: 0,
        targetX: FIELD_W - 310,
        targetY: 130 + i * 110,
      });
    }
    for (let i = 0; i < 3; i++) {
      ai.push({
        x: FIELD_W - 420,
        y: 130 + i * 110,
        vx: 0,
        vy: 0,
        targetX: FIELD_W - 420,
        targetY: 130 + i * 110,
      });
    }
    return ai;
  }, []);

  const resetKickoff = useCallback(
    (scoredByUser: boolean | null = null) => {
      const g = gameRef.current;
      g.ball = { x: FIELD_W / 2, y: FIELD_H / 2, vx: 0, vy: 0 };
      g.player = { x: FIELD_W / 4, y: FIELD_H / 2, vx: 0, vy: 0 };
      g.aiPlayers = initAI();
      if (scoredByUser !== null) {
        g.phase = "goal";
        g.goalTimer = 2.5;
      } else {
        g.phase = "kickoff";
        g.kickoffTimer = 1.5;
      }
    },
    [initAI],
  );

  useEffect(() => {
    gameRef.current.aiPlayers = initAI();
  }, [initAI]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (
        [" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        e.preventDefault();
      }
    };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const touchRef = useRef({ dx: 0, dy: 0, shoot: false });

  const drawField = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "#1a5c2a";
    ctx.fillRect(0, 0, FIELD_W, FIELD_H);
    for (let i = 0; i < 10; i++) {
      if (i % 2 === 0) {
        ctx.fillStyle = "#1e6530";
        ctx.fillRect(i * (FIELD_W / 10), 0, FIELD_W / 10, FIELD_H);
      }
    }
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, FIELD_W - 40, FIELD_H - 40);
    ctx.beginPath();
    ctx.moveTo(FIELD_W / 2, 20);
    ctx.lineTo(FIELD_W / 2, FIELD_H - 20);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(FIELD_W / 2, FIELD_H / 2, 60, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.beginPath();
    ctx.arc(FIELD_W / 2, FIELD_H / 2, 4, 0, Math.PI * 2);
    ctx.fill();
    const penW = 120;
    const penH = 240;
    ctx.strokeRect(20, (FIELD_H - penH) / 2, penW, penH);
    ctx.strokeRect(FIELD_W - 20 - penW, (FIELD_H - penH) / 2, penW, penH);
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 3;
    ctx.strokeRect(20 - GOAL_W, (FIELD_H - GOAL_H) / 2, GOAL_W, GOAL_H);
    ctx.strokeRect(FIELD_W - 20, (FIELD_H - GOAL_H) / 2, GOAL_W, GOAL_H);
  }, []);

  const drawPlayer = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      color: string,
      kitColor: string,
      isUser = false,
    ) => {
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.beginPath();
      ctx.ellipse(
        x,
        y + PLAYER_R,
        PLAYER_R * 0.9,
        PLAYER_R * 0.35,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.fillStyle = kitColor;
      ctx.beginPath();
      ctx.arc(x, y, PLAYER_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = isUser ? 3 : 1.5;
      ctx.stroke();
      if (isUser) {
        ctx.fillStyle = "#ffff00";
        ctx.beginPath();
        ctx.moveTo(x, y - PLAYER_R - 12);
        ctx.lineTo(x - 6, y - PLAYER_R - 4);
        ctx.lineTo(x + 6, y - PLAYER_R - 4);
        ctx.closePath();
        ctx.fill();
      }
    },
    [],
  );

  const drawBall = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.ellipse(x + 2, y + 4, BALL_R * 0.9, BALL_R * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(x, y, BALL_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = "#222";
      ctx.beginPath();
      ctx.arc(x - 2, y - 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
    },
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lineup = state.players.filter((p) => p.inLineup);
    const userAvg =
      lineup.length > 0
        ? lineup.reduce((s, p) => s + p.rating, 0) / lineup.length
        : 70;
    const aiRating = 62 + Math.floor(Math.random() * 20);
    const skillRatio = userAvg / aiRating;

    const loop = (ts: number) => {
      const g = gameRef.current;
      if (g.lastTs === 0) g.lastTs = ts;
      const dtRaw = Math.min((ts - g.lastTs) / 1000, 0.05);
      g.lastTs = ts;

      if (g.phase === "goal") {
        g.goalTimer -= dtRaw;
        if (g.goalTimer <= 0) {
          g.phase = "kickoff";
          g.kickoffTimer = 1.5;
          setPhase("kickoff");
        }
      } else if (g.phase === "kickoff") {
        g.kickoffTimer -= dtRaw;
        if (g.kickoffTimer <= 0) {
          g.phase = "play";
          setPhase("play");
          g.ball.vx = (g.possession === "user" ? 1 : -1) * 80;
        }
      } else if (g.phase === "play") {
        const dt = dtRaw;
        g.elapsed += dt;
        const minute = Math.min(
          90,
          Math.floor((g.elapsed / MATCH_DURATION) * 90),
        );
        setMinuteDisplay(minute);

        if (g.elapsed >= MATCH_DURATION) {
          g.phase = "ended";
          setPhase("ended");
          const outcome: "W" | "D" | "L" =
            g.scoreUser > g.scoreAI
              ? "W"
              : g.scoreUser === g.scoreAI
                ? "D"
                : "L";
          const coinsEarned =
            outcome === "W" ? 500 : outcome === "D" ? 200 : 100;
          const matchResult: MatchResult = {
            id: Date.now(),
            opponent: opponentNameRef.current,
            goalsFor: g.scoreUser,
            goalsAgainst: g.scoreAI,
            result: outcome,
            coinsEarned,
            date: new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
          };
          setTimeout(() => onMatchEnd(matchResult), 1500);
          rafRef.current = requestAnimationFrame(loop);
          render(ctx, g);
          return;
        }

        const spd = 180;
        let pdx = 0;
        let pdy = 0;
        if (
          keysRef.current.has("ArrowUp") ||
          keysRef.current.has("w") ||
          keysRef.current.has("W")
        )
          pdy -= 1;
        if (
          keysRef.current.has("ArrowDown") ||
          keysRef.current.has("s") ||
          keysRef.current.has("S")
        )
          pdy += 1;
        if (
          keysRef.current.has("ArrowLeft") ||
          keysRef.current.has("a") ||
          keysRef.current.has("A")
        )
          pdx -= 1;
        if (
          keysRef.current.has("ArrowRight") ||
          keysRef.current.has("d") ||
          keysRef.current.has("D")
        )
          pdx += 1;
        pdx += touchRef.current.dx;
        pdy += touchRef.current.dy;
        const pl = Math.hypot(pdx, pdy) || 1;
        if (pl > 0 && (pdx !== 0 || pdy !== 0)) {
          g.player.x = clamp(
            g.player.x + (pdx / pl) * spd * dt,
            PLAYER_R + 20,
            FIELD_W - PLAYER_R - 20,
          );
          g.player.y = clamp(
            g.player.y + (pdy / pl) * spd * dt,
            PLAYER_R + 20,
            FIELD_H - PLAYER_R - 20,
          );
        }

        const shoot =
          keysRef.current.has(" ") ||
          keysRef.current.has("x") ||
          keysRef.current.has("X") ||
          touchRef.current.shoot;
        if (shoot && dist(g.player, g.ball) < PLAYER_R + BALL_R + 8) {
          const goalX = FIELD_W - 20 + GOAL_W / 2;
          const goalY = FIELD_H / 2 + (Math.random() - 0.5) * GOAL_H * 0.7;
          const d = norm({ x: goalX - g.ball.x, y: goalY - g.ball.y });
          const power = 500 + Math.random() * 100;
          g.ball.vx = d.x * power;
          g.ball.vy = d.y * power;
          g.possession = "user";
        }

        const aiSpd = 100 * (1 / skillRatio);
        const closestAI = g.aiPlayers.reduce(
          (best, ai) => (dist(ai, g.ball) < dist(best, g.ball) ? ai : best),
          g.aiPlayers[0],
        );
        for (const ai of g.aiPlayers) {
          let tx: number;
          let ty: number;
          if (ai === closestAI) {
            tx = g.ball.x;
            ty = g.ball.y;
          } else {
            tx = ai.targetX;
            ty = ai.targetY;
          }
          const d = { x: tx - ai.x, y: ty - ai.y };
          const dn = norm(d);
          const dd = Math.hypot(d.x, d.y);
          if (dd > 5) {
            ai.x += dn.x * aiSpd * dt;
            ai.y += dn.y * aiSpd * dt;
          }
          if (ai === closestAI && dist(ai, g.ball) < PLAYER_R + BALL_R + 4) {
            const goalX = 20 - GOAL_W / 2;
            const goalY = FIELD_H / 2 + (Math.random() - 0.5) * GOAL_H * 0.7;
            const dk = norm({ x: goalX - g.ball.x, y: goalY - g.ball.y });
            const power = (350 + Math.random() * 100) / skillRatio;
            g.ball.vx = dk.x * power;
            g.ball.vy = dk.y * power;
            g.possession = "ai";
          }
        }

        const friction = 0.93;
        g.ball.vx *= friction ** (60 * dt);
        g.ball.vy *= friction ** (60 * dt);
        g.ball.x += g.ball.vx * dt;
        g.ball.y += g.ball.vy * dt;

        if (g.ball.y - BALL_R < 20) {
          g.ball.y = 20 + BALL_R;
          g.ball.vy *= -0.7;
        }
        if (g.ball.y + BALL_R > FIELD_H - 20) {
          g.ball.y = FIELD_H - 20 - BALL_R;
          g.ball.vy *= -0.7;
        }
        const goalTop = (FIELD_H - GOAL_H) / 2;
        const goalBot = (FIELD_H + GOAL_H) / 2;
        if (g.ball.x - BALL_R < 20) {
          if (g.ball.y > goalTop && g.ball.y < goalBot) {
            g.scoreAI++;
            setScoreDisplay({ user: g.scoreUser, ai: g.scoreAI });
            g.possession = "user";
            resetKickoff(false);
          } else {
            g.ball.x = 20 + BALL_R;
            g.ball.vx *= -0.7;
          }
        }
        if (g.ball.x + BALL_R > FIELD_W - 20) {
          if (g.ball.y > goalTop && g.ball.y < goalBot) {
            g.scoreUser++;
            setScoreDisplay({ user: g.scoreUser, ai: g.scoreAI });
            g.possession = "ai";
            resetKickoff(true);
          } else {
            g.ball.x = FIELD_W - 20 - BALL_R;
            g.ball.vx *= -0.7;
          }
        }

        if (dist(g.player, g.ball) < PLAYER_R + BALL_R) {
          const d = norm({
            x: g.ball.x - g.player.x,
            y: g.ball.y - g.player.y,
          });
          g.ball.x = g.player.x + d.x * (PLAYER_R + BALL_R + 1);
          g.ball.y = g.player.y + d.y * (PLAYER_R + BALL_R + 1);
          if (Math.abs(g.ball.vx) < 60 && Math.abs(g.ball.vy) < 60) {
            g.ball.vx = d.x * 80;
            g.ball.vy = d.y * 80;
          }
        }
      }

      render(ctx, g);
      rafRef.current = requestAnimationFrame(loop);
    };

    const render = (
      ctx: CanvasRenderingContext2D,
      g: typeof gameRef.current,
    ) => {
      drawField(ctx);
      for (const ai of g.aiPlayers) {
        drawPlayer(ctx, ai.x, ai.y, "#cc0000", "#e83030");
      }
      drawPlayer(ctx, g.player.x, g.player.y, "#0055ff", "#2277ff", true);
      drawBall(ctx, g.ball.x, g.ball.y);

      ctx.fillStyle = "rgba(0,0,0,0.65)";
      ctx.roundRect(FIELD_W / 2 - 120, 8, 240, 38, 8);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 18px 'Arial', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${g.scoreUser}  –  ${g.scoreAI}`, FIELD_W / 2, 32);

      if (g.phase === "kickoff") {
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, 0, FIELD_W, FIELD_H);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 42px 'Arial', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("KICK OFF!", FIELD_W / 2, FIELD_H / 2);
        ctx.font = "18px 'Arial', sans-serif";
        ctx.fillStyle = "#aaaaaa";
        ctx.fillText(
          "Arrow keys / WASD to move  •  SPACE / X to shoot",
          FIELD_W / 2,
          FIELD_H / 2 + 40,
        );
      }
      if (g.phase === "goal") {
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, 0, FIELD_W, FIELD_H);
        ctx.fillStyle = g.scoreUser > g.scoreAI ? "#44ff88" : "#ff4444";
        ctx.font = "bold 64px 'Arial', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          g.scoreUser > g.scoreAI ? "GOAL! ⚽" : "OHHH! 😬",
          FIELD_W / 2,
          FIELD_H / 2,
        );
      }
      if (g.phase === "ended") {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, FIELD_W, FIELD_H);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 52px 'Arial', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("FULL TIME!", FIELD_W / 2, FIELD_H / 2 - 30);
        ctx.font = "bold 36px 'Arial', sans-serif";
        ctx.fillStyle =
          g.scoreUser > g.scoreAI
            ? "#44ff88"
            : g.scoreUser < g.scoreAI
              ? "#ff4444"
              : "#ffcc44";
        ctx.fillText(
          g.scoreUser > g.scoreAI
            ? "VICTORY"
            : g.scoreUser < g.scoreAI
              ? "DEFEAT"
              : "DRAW",
          FIELD_W / 2,
          FIELD_H / 2 + 20,
        );
      }
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [
    state,
    drawField,
    drawPlayer,
    drawBall,
    resetKickoff,
    onMatchEnd,
    setPhase,
  ]);

  const joystickRef = useRef<{ id: number; sx: number; sy: number } | null>(
    null,
  );
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.clientX > window.innerWidth * 0.6) {
        touchRef.current.shoot = true;
      } else {
        joystickRef.current = {
          id: t.identifier,
          sx: t.clientX,
          sy: t.clientY,
        };
      }
    }
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!joystickRef.current) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier === joystickRef.current.id) {
        const dx = (t.clientX - joystickRef.current.sx) / 40;
        const dy = (t.clientY - joystickRef.current.sy) / 40;
        const mag = Math.hypot(dx, dy);
        touchRef.current.dx = mag > 1 ? dx / mag : dx;
        touchRef.current.dy = mag > 1 ? dy / mag : dy;
      }
    }
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (joystickRef.current?.id === t.identifier) {
        touchRef.current.dx = 0;
        touchRef.current.dy = 0;
        joystickRef.current = null;
      } else {
        touchRef.current.shoot = false;
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex items-center justify-between w-full max-w-4xl">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-border/60 bg-card font-display text-sm tracking-widest hover:bg-secondary transition-colors"
        >
          ← BACK
        </button>
        <div className="flex items-center gap-6 font-display text-sm tracking-widest text-muted-foreground">
          <span className="text-foreground">{state.teamName}</span>
          <span className="text-2xl text-foreground">
            {scoreDisplay.user} – {scoreDisplay.ai}
          </span>
          <span className="text-foreground">{opponentNameRef.current}</span>
        </div>
        <div className="font-display text-lg tracking-widest text-primary">
          {minuteDisplay}'
        </div>
      </div>

      <div
        className="relative rounded-xl overflow-hidden border-2 border-border/40 shadow-2xl"
        style={{ touchAction: "none" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <canvas
          ref={canvasRef}
          width={FIELD_W}
          height={FIELD_H}
          tabIndex={0}
          style={{ display: "block", maxWidth: "100%", height: "auto" }}
        />
      </div>

      <div className="text-center text-muted-foreground text-xs font-display tracking-wide">
        <span className="hidden sm:inline">
          ARROW KEYS / WASD: MOVE &nbsp;•&nbsp; SPACE / X: SHOOT &nbsp;•&nbsp;{" "}
        </span>
        <span className="sm:hidden">
          LEFT SIDE: MOVE &nbsp;•&nbsp; RIGHT SIDE: SHOOT &nbsp;•&nbsp;{" "}
        </span>
        YELLOW ARROW = YOUR PLAYER &nbsp;•&nbsp; RED = OPPONENTS
      </div>

      <div className="sm:hidden flex gap-4">
        <button
          type="button"
          className="px-8 py-5 rounded-2xl font-display text-xl tracking-widest bg-primary text-primary-foreground active:scale-95 transition-transform select-none"
          onTouchStart={(e) => {
            e.preventDefault();
            touchRef.current.shoot = true;
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            touchRef.current.shoot = false;
          }}
        >
          SHOOT ⚽
        </button>
      </div>
    </div>
  );
}

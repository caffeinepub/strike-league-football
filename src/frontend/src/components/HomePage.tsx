import { motion } from "motion/react";
import type { TeamStanding, View } from "../types/game";

interface HomePageProps {
  onNavigate: (view: View) => void;
  standings: TeamStanding[];
  teamName: string;
  coins: number;
}

const FEATURES = [
  {
    icon: "🛡️",
    title: "BUILD YOUR SQUAD",
    desc: "Assemble your ultimate eleven. Choose your formation and put your best players on the pitch.",
  },
  {
    icon: "⚡",
    title: "SIMULATE MATCHES",
    desc: "Step into matchday with intelligent simulation based on your squad's overall rating.",
  },
  {
    icon: "⭐",
    title: "RECRUIT STARS",
    desc: "Discover and sign world-class talent to elevate your team above the competition.",
  },
  {
    icon: "🏆",
    title: "CLIMB THE TABLE",
    desc: "Fight through the league. Every win counts. Rise to the summit and lift the trophy.",
  },
];

export function HomePage({
  onNavigate,
  standings,
  teamName,
  coins,
}: HomePageProps) {
  const topStandings = standings.slice(0, 5);

  return (
    <main>
      {/* Hero */}
      <section
        className="relative min-h-screen flex items-center"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-stadium.dim_1920x1080.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
        }}
      >
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 pitch-gradient" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full pt-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: headline */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 max-w-12 bg-primary" />
                <span className="font-display text-primary text-sm tracking-[0.3em]">
                  FOOTBALL MANAGER
                </span>
              </div>
              <h1
                className="font-display text-7xl lg:text-8xl leading-none mb-6 text-shadow-glow"
                style={{ lineHeight: 0.95 }}
              >
                LEAD YOUR TEAM
                <br />
                <span className="text-primary">TO GLORY.</span>
              </h1>
              <p className="text-muted-foreground text-lg mb-8 max-w-md leading-relaxed">
                Build your dream squad, recruit world-class players, and
                dominate the league in Strike League — the ultimate football
                management experience.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate("matches")}
                  className="font-display text-lg tracking-widest px-8 py-4 rounded-xl transition-all hover:shadow-glow-lg active:scale-95"
                  style={{
                    background: "oklch(0.82 0.19 145)",
                    color: "oklch(0.1 0.02 145)",
                  }}
                  data-ocid="home.start_career.button"
                >
                  START YOUR CAREER – FREE TO PLAY
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("squad")}
                  className="font-display text-lg tracking-widest px-8 py-4 rounded-xl border border-border/60 text-foreground transition-all hover:bg-secondary/50 active:scale-95"
                  data-ocid="home.view_squad.button"
                >
                  VIEW SQUAD
                </button>
              </div>
              <div className="mt-8 flex items-center gap-6">
                <div className="text-center">
                  <div className="font-display text-3xl text-primary">
                    {coins.toLocaleString()}
                  </div>
                  <div className="text-muted-foreground text-xs font-display tracking-widest">
                    COINS
                  </div>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center">
                  <div className="font-display text-3xl text-foreground">
                    {teamName}
                  </div>
                  <div className="text-muted-foreground text-xs font-display tracking-widest">
                    YOUR CLUB
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Match preview card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="hidden lg:block"
            >
              <MatchPreviewCard teamName={teamName} standings={topStandings} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        className="py-24 px-4"
        style={{ background: "oklch(0.11 0.02 195)" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-primary" />
              <span className="font-display text-primary tracking-[0.3em] text-sm">
                WHAT WE OFFER
              </span>
              <div className="h-px w-12 bg-primary" />
            </div>
            <h2 className="font-display text-6xl text-foreground">FEATURES</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl card-glow border border-border/60 group hover:border-primary/40 transition-colors"
                style={{ background: "oklch(0.17 0.02 195)" }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform"
                  style={{
                    background: "oklch(0.82 0.19 145 / 0.12)",
                    border: "1px solid oklch(0.82 0.19 145 / 0.3)",
                  }}
                >
                  {f.icon}
                </div>
                <h3 className="font-display text-xl text-primary mb-2">
                  {f.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Standings Preview */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-primary" />
              <span className="font-display text-primary tracking-[0.3em] text-sm">
                LIVE TABLE
              </span>
              <div className="h-px w-12 bg-primary" />
            </div>
            <h2 className="font-display text-6xl text-foreground">
              GLOBAL STANDINGS
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border/60 overflow-hidden card-glow"
            style={{ background: "oklch(0.17 0.02 195)" }}
          >
            <div
              className="px-6 py-4 border-b border-border/60 flex items-center justify-between"
              style={{ background: "oklch(0.13 0.025 195)" }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                <span className="font-display text-xl tracking-widest text-foreground">
                  STRIKE PREMIER LEAGUE
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("standings")}
                className="font-display text-xs tracking-widest text-primary hover:text-primary/80 transition-colors"
                data-ocid="home.view_standings.button"
              >
                VIEW ALL →
              </button>
            </div>

            <div className="divide-y divide-border/40">
              {topStandings.map((team, idx) => (
                <div
                  key={team.name}
                  className={`px-6 py-4 flex items-center gap-4 transition-colors ${
                    team.isUser
                      ? "bg-primary/5 border-l-2 border-primary"
                      : "hover:bg-secondary/30"
                  }`}
                >
                  <span
                    className={`font-display text-lg w-6 ${
                      idx === 0
                        ? "text-yellow-400"
                        : idx === 1
                          ? "text-gray-300"
                          : idx === 2
                            ? "text-amber-600"
                            : "text-muted-foreground"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <span
                      className={`font-display text-base tracking-wide ${
                        team.isUser ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {team.name} {team.isUser && "⚡"}
                    </span>
                  </div>
                  <div className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground font-display tracking-wider">
                    <span>P {team.played}</span>
                    <span>W {team.won}</span>
                    <span>GD {team.gf - team.ga}</span>
                  </div>
                  <div
                    className="font-display text-lg w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      background: team.isUser
                        ? "oklch(0.82 0.19 145 / 0.2)"
                        : "oklch(0.22 0.025 195)",
                      color: team.isUser
                        ? "oklch(0.82 0.19 145)"
                        : "oklch(0.97 0 0)",
                    }}
                  >
                    {team.points}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t border-border/60 py-12 px-4"
        style={{ background: "oklch(0.11 0.02 195)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⚽</span>
                <div>
                  <div className="font-display text-lg text-primary tracking-wider">
                    STRIKE
                  </div>
                  <div className="font-display text-xs text-muted-foreground tracking-widest">
                    LEAGUE
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                The ultimate football management experience. Build. Recruit.
                Dominate.
              </p>
            </div>
            <div>
              <h4 className="font-display text-sm tracking-widest text-foreground mb-4">
                GAME
              </h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                {(["squad", "recruit", "matches", "standings"] as View[]).map(
                  (v) => (
                    <li key={v}>
                      <button
                        type="button"
                        onClick={() => onNavigate(v)}
                        className="hover:text-primary transition-colors capitalize font-display tracking-wide"
                      >
                        {v.toUpperCase()}
                      </button>
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-display text-sm tracking-widest text-foreground mb-4">
                STAY CONNECTED
              </h4>
              <div className="flex gap-3">
                {["🐦", "📘", "📸", "🎮"].map((icon) => (
                  <div
                    key={icon}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-base cursor-pointer hover:scale-110 transition-transform"
                    style={{
                      background: "oklch(0.22 0.025 195)",
                      border: "1px solid oklch(0.27 0.025 195)",
                    }}
                  >
                    {icon}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-display text-sm tracking-widest text-foreground mb-4">
                NEWSLETTER
              </h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60"
                />
                <button
                  type="button"
                  className="px-3 py-2 rounded-lg font-display text-xs tracking-wider transition-all hover:shadow-glow"
                  style={{
                    background: "oklch(0.82 0.19 145)",
                    color: "oklch(0.1 0.02 145)",
                  }}
                >
                  JOIN
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-border/40 pt-6 text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function MatchPreviewCard({
  teamName,
  standings,
}: { teamName: string; standings: TeamStanding[] }) {
  const opponent = standings.find((s) => !s.isUser)?.name ?? "Ironclad FC";
  const user = standings.find((s) => s.isUser);

  return (
    <div
      className="rounded-2xl border border-border/60 overflow-hidden card-glow max-w-sm ml-auto"
      style={{ background: "oklch(0.17 0.02 195)" }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 border-b border-border/40 flex items-center justify-between"
        style={{ background: "oklch(0.13 0.025 195)" }}
      >
        <span className="font-display text-xs tracking-[0.3em] text-muted-foreground">
          MATCHDAY 13
        </span>
        <span className="font-display text-xs text-primary tracking-wider">
          LIVE
        </span>
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
      </div>

      {/* Score */}
      <div className="px-5 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="text-center flex-1">
            <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-xl mx-auto mb-2">
              ⚽
            </div>
            <div className="font-display text-sm tracking-wide text-foreground">
              {teamName}
            </div>
          </div>
          <div className="text-center px-4">
            <div className="font-display text-4xl text-foreground tracking-wider">
              2 <span className="text-primary">:</span> 1
            </div>
            <div className="font-display text-xs text-muted-foreground tracking-widest mt-1">
              67'
            </div>
          </div>
          <div className="text-center flex-1">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-xl mx-auto mb-2">
              🛡️
            </div>
            <div className="font-display text-sm tracking-wide text-foreground">
              {opponent}
            </div>
          </div>
        </div>

        {/* Stats mini */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs font-display tracking-wide">
            <span className="text-primary w-6 text-right">68%</span>
            <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: "68%" }}
              />
            </div>
            <span className="text-muted-foreground w-6">32%</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground font-display tracking-wide">
            <span>POSSESSION</span>
            <span />
          </div>
          <div className="flex items-center gap-3 text-xs font-display tracking-wide">
            <span className="text-primary w-6 text-right">7</span>
            <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: "58%" }}
              />
            </div>
            <span className="text-muted-foreground w-6">5</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground font-display tracking-wide">
            <span>SHOTS</span>
            <span />
          </div>
        </div>

        {user && (
          <div className="mt-4 pt-4 border-t border-border/40 grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="font-display text-xl text-foreground">
                {user.won}
              </div>
              <div className="font-display text-xs text-muted-foreground tracking-widest">
                WIN
              </div>
            </div>
            <div>
              <div className="font-display text-xl text-foreground">
                {user.drawn}
              </div>
              <div className="font-display text-xs text-muted-foreground tracking-widest">
                DRAW
              </div>
            </div>
            <div>
              <div className="font-display text-xl text-foreground">
                {user.lost}
              </div>
              <div className="font-display text-xs text-muted-foreground tracking-widest">
                LOSS
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

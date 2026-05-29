import StatCard from "@/components/dashboard/stat-card";
import ResultBadge from "@/components/dashboard/result-badge";

import { latestResults, leagueStats } from "@/lib/mock-results";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex w-full max-w-[430px] flex-col gap-4 px-3 pb-28 pt-4 sm:max-w-7xl sm:gap-8 sm:px-8 sm:pb-12 sm:pt-8 lg:px-10">
        <header className="rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.10),transparent_34%),linear-gradient(135deg,#18181b,#09090b_55%,#000)] p-4 shadow-2xl sm:rounded-3xl sm:p-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-emerald-400 sm:mb-3 sm:text-sm sm:tracking-[0.3em]">
                Pro Football Intel Results
              </p>

              <h1 className="max-w-3xl text-[2rem] font-bold leading-[1.04] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                Verified prediction performance dashboard.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:mt-5 sm:text-lg sm:leading-8">
                Public read-only results, accuracy tracking and recent pick
                outcomes for Pro Football Intel.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:w-64 sm:p-4">
              <label className="mb-2 block text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-zinc-500 sm:text-xs">
                Season
              </label>

              <select className="w-full rounded-xl border border-white/10 bg-black px-3 py-2.5 text-sm font-semibold text-white outline-none sm:px-4 sm:py-3">
                <option>2026/27 Mock Season</option>
                <option>2025/26 Archive</option>
              </select>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          <StatCard
            label="Overall Accuracy"
            value="68%"
            detail="46 won / 22 lost"
          />

          <StatCard label="Won" value="46" detail="Winning picks" />

          <StatCard label="Lost" value="22" detail="Losing picks" />

          <StatCard label="Pending" value="8" detail="Awaiting scores" />
        </section>

        <section className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          <div className="rounded-[24px] border border-white/10 bg-zinc-950/95 p-4 sm:rounded-3xl sm:p-6 lg:col-span-2">
            <SectionHeader
              eyebrow="League Accuracy"
              title="Breakdown by league"
              note="Mock data preview"
            />

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {leagueStats.map((item) => (
                <div
                  key={item.league}
                  className="rounded-2xl border border-white/10 bg-black/55 p-3.5 sm:p-5"
                >
                  <p className="truncate text-xs font-medium text-zinc-400 sm:text-sm">
                    {item.league}
                  </p>

                  <p className="mt-2 text-[2rem] font-bold leading-none tracking-tight text-white sm:mt-3 sm:text-3xl">
                    {item.accuracy}
                  </p>

                  <p className="mt-1.5 text-xs font-medium text-zinc-500 sm:mt-2 sm:text-sm">
                    {item.record}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-emerald-400/20 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.16),transparent_36%),rgba(16,185,129,0.08)] p-4 sm:rounded-3xl sm:p-6">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-emerald-300 sm:text-sm sm:tracking-[0.25em]">
              Strongest Pick
            </p>

            <div className="mt-3 grid grid-cols-[1fr_auto] items-start gap-4 sm:mt-4 sm:block">
              <div>
                <h2 className="text-[1.75rem] font-bold leading-[1.08] tracking-tight sm:text-2xl">
                  Highest-confidence picks
                </h2>

                <p className="mt-2 max-w-[13rem] text-sm leading-6 text-zinc-300 sm:mt-3 sm:max-w-none">
                  Mock accuracy for strongest confidence picks.
                </p>
              </div>

              <p className="text-[3rem] font-bold leading-none tracking-tight text-emerald-300 sm:mt-6 sm:text-5xl">
                74%
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/35 px-3.5 py-3 sm:mt-6 sm:p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-zinc-400">Record</p>
                <p className="text-lg font-bold text-white sm:text-xl">
                  23W / 8L
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-zinc-950/95 p-4 sm:rounded-3xl sm:p-6">
          <SectionHeader eyebrow="Latest Results" title="Recent settled picks" />

          <div className="space-y-2.5 md:hidden">
            {latestResults.map((match) => (
              <article
                key={`${match.home}-${match.away}-mobile`}
                className="rounded-2xl border border-white/10 bg-black/50 p-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[1.05rem] font-bold leading-snug text-white">
                      {match.home} vs {match.away}
                    </p>

                    <p className="mt-0.5 truncate text-xs font-medium text-zinc-500">
                      {match.league}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <ResultBadge result={match.result} />
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-zinc-500">
                      Pick
                    </p>

                    <p className="mt-1 truncate text-sm font-bold text-zinc-200">
                      {match.pick}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-zinc-500">
                      Score
                    </p>

                    <p className="mt-1 text-sm font-bold text-zinc-200">
                      {match.score}
                    </p>
                  </div>
                </div>

                <p className="mt-2 text-[0.7rem] font-medium text-zinc-600">
                  Verified by manual review
                </p>
              </article>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-white/10 md:block">
            <div className="grid grid-cols-6 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              <span>Match</span>
              <span>League</span>
              <span>Pick</span>
              <span>Score</span>
              <span>Status</span>
              <span>Verified</span>
            </div>

            {latestResults.map((match) => (
              <div
                key={`${match.home}-${match.away}`}
                className="grid grid-cols-6 items-center gap-3 border-t border-white/10 px-5 py-5 text-sm"
              >
                <div className="font-semibold">
                  {match.home} vs {match.away}
                </div>

                <div className="text-zinc-400">{match.league}</div>

                <div className="text-zinc-300">{match.pick}</div>

                <div className="text-zinc-400">{match.score}</div>

                <div>
                  <ResultBadge result={match.result} />
                </div>

                <div className="text-zinc-500">Manual review</div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function SectionHeader({
  eyebrow,
  title,
  note,
}: {
  eyebrow: string;
  title: string;
  note?: string;
}) {
  return (
    <div className="mb-4 flex flex-col gap-1 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-emerald-400 sm:text-sm sm:tracking-[0.25em]">
          {eyebrow}
        </p>

        <h2 className="mt-1.5 text-[1.65rem] font-bold leading-tight tracking-tight text-white sm:mt-2 sm:text-2xl">
          {title}
        </h2>
      </div>

      {note ? <p className="text-xs text-zinc-500 sm:text-sm">{note}</p> : null}
    </div>
  );
}
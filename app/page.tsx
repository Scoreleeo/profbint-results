import StatCard from "@/components/dashboard/stat-card";
import ResultBadge from "@/components/dashboard/result-badge";

import { latestResults, leagueStats } from "@/lib/mock-results";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:gap-10 sm:px-8 sm:py-8 lg:px-10">
        <header className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-5 shadow-2xl sm:rounded-3xl sm:p-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-400 sm:text-sm sm:tracking-[0.3em]">
                Pro Football Intel Results
              </p>

              <h1 className="max-w-3xl text-[2.35rem] font-bold leading-[1.03] tracking-tight sm:text-5xl lg:text-6xl">
                Verified prediction performance dashboard.
              </h1>

              <p className="mt-4 max-w-2xl text-[1.05rem] leading-8 text-zinc-400 sm:mt-5 sm:text-lg">
                Public read-only results, accuracy tracking and recent pick
                outcomes for Pro Football Intel.
              </p>
            </div>

            <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 sm:w-64 sm:p-4">
              <label className="mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.24em] text-zinc-500 sm:text-xs">
                Season
              </label>

              <select className="w-full rounded-xl border border-white/10 bg-black px-3 py-3 text-sm font-semibold text-white outline-none sm:px-4">
                <option>2026/27 Mock Season</option>
                <option>2025/26 Archive</option>
              </select>
            </div>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          <StatCard
            label="Overall Accuracy"
            value="68%"
            detail="46 won / 22 lost"
          />

          <StatCard label="Won" value="46" detail="Settled winning picks" />

          <StatCard label="Lost" value="22" detail="Settled losing picks" />

          <StatCard label="Pending" value="8" detail="Awaiting final scores" />
        </section>

        <section className="grid gap-5 sm:gap-6 lg:grid-cols-3">
          <div className="rounded-[1.75rem] border border-white/10 bg-zinc-950 p-5 sm:rounded-3xl sm:p-6 lg:col-span-2">
            <div className="mb-5 flex flex-col gap-1 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-400 sm:text-sm sm:tracking-[0.25em]">
                  League Accuracy
                </p>

                <h2 className="mt-2 text-3xl font-bold leading-tight sm:text-2xl">
                  Breakdown by league
                </h2>
              </div>

              <p className="text-sm text-zinc-500">Mock data preview</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {leagueStats.map((item) => (
                <div
                  key={item.league}
                  className="rounded-2xl border border-white/10 bg-black/60 p-4 sm:p-5"
                >
                  <p className="truncate text-sm text-zinc-400">
                    {item.league}
                  </p>

                  <p className="mt-3 text-3xl font-bold leading-none text-white sm:text-3xl">
                    {item.accuracy}
                  </p>

                  <p className="mt-2 text-sm text-zinc-500">{item.record}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-emerald-400/20 bg-emerald-400/10 p-5 sm:rounded-3xl sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300 sm:text-sm sm:tracking-[0.25em]">
              Strongest Pick
            </p>

            <div className="mt-4 grid grid-cols-[1fr_auto] items-start gap-4 sm:block">
              <div>
                <h2 className="text-2xl font-bold leading-tight sm:mt-4">
                  Highest-confidence picks
                </h2>

                <p className="mt-3 text-sm leading-6 text-zinc-300 sm:mt-3">
                  Mock accuracy for strongest confidence picks.
                </p>
              </div>

              <p className="text-5xl font-bold leading-none text-emerald-300 sm:mt-6">
                74%
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-4 sm:mt-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-zinc-400">Record</p>
                <p className="text-xl font-semibold">23W / 8L</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-white/10 bg-zinc-950 p-5 sm:rounded-3xl sm:p-6">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-400 sm:text-sm sm:tracking-[0.25em]">
              Latest Results
            </p>

            <h2 className="mt-2 text-3xl font-bold leading-tight sm:text-2xl">
              Recent settled picks
            </h2>
          </div>

          <div className="space-y-3 md:hidden">
            {latestResults.map((match) => (
              <article
                key={`${match.home}-${match.away}-mobile`}
                className="rounded-2xl border border-white/10 bg-black/50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-base font-semibold leading-snug text-white">
                      {match.home} vs {match.away}
                    </p>

                    <p className="mt-1 truncate text-xs text-zinc-500">
                      {match.league}
                    </p>
                  </div>

                  <ResultBadge result={match.result} />
                </div>

                <div className="mt-3 grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      Pick
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-zinc-200">
                      {match.pick}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      Score
                    </p>

                    <p className="mt-1 text-sm font-semibold text-zinc-200">
                      {match.score}
                    </p>
                  </div>
                </div>

                <p className="mt-2 text-[0.7rem] text-zinc-600">
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
import { latestResults, leagueStats, type ResultStatus } from "@/lib/mock-results";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-8 sm:px-8 lg:px-10">
        <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-6 shadow-2xl sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
                Pro Football Intel Results
              </p>
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Verified prediction performance dashboard.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
                Public read-only results, accuracy tracking and recent pick
                outcomes for Pro Football Intel.
              </p>
            </div>

            <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 sm:w-64">
              <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-zinc-500">
                Season
              </label>
              <select className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm font-semibold text-white outline-none">
                <option>2026/27 Mock Season</option>
                <option>2025/26 Archive</option>
              </select>
            </div>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Overall Accuracy" value="68%" detail="46 won / 22 lost" />
          <StatCard label="Won" value="46" detail="Settled winning picks" />
          <StatCard label="Lost" value="22" detail="Settled losing picks" />
          <StatCard label="Pending" value="8" detail="Awaiting final scores" />
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6 lg:col-span-2">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
                  League Accuracy
                </p>
                <h2 className="mt-2 text-2xl font-bold">Breakdown by league</h2>
              </div>
              <p className="text-sm text-zinc-500">Mock data preview</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {leagueStats.map((item) => (
                <div
                  key={item.league}
                  className="rounded-2xl border border-white/10 bg-black/60 p-5"
                >
                  <p className="text-sm text-zinc-400">{item.league}</p>
                  <p className="mt-3 text-3xl font-bold text-white">
                    {item.accuracy}
                  </p>
                  <p className="mt-2 text-sm text-zinc-500">{item.record}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
              Strongest Pick
            </p>
            <h2 className="mt-4 text-2xl font-bold">Highest-confidence picks</h2>
            <p className="mt-6 text-5xl font-bold text-emerald-300">74%</p>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Mock accuracy for picks marked as strongest confidence.
            </p>
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-sm text-zinc-400">Record</p>
              <p className="mt-1 text-xl font-semibold">23W / 8L</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Latest Results
            </p>
            <h2 className="mt-2 text-2xl font-bold">Recent settled picks</h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="hidden grid-cols-6 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-widest text-zinc-500 md:grid">
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
                className="grid gap-3 border-t border-white/10 px-5 py-5 text-sm md:grid-cols-6 md:items-center"
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

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-xl">
      <p className="text-sm font-medium text-zinc-400">{label}</p>
      <p className="mt-4 text-4xl font-bold">{value}</p>
      <p className="mt-2 text-sm text-zinc-500">{detail}</p>
    </div>
  );
}

function ResultBadge({ result }: { result: ResultStatus }) {
  const className =
    result === "WON"
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
      : result === "LOST"
        ? "border-red-400/20 bg-red-400/10 text-red-300"
        : "border-yellow-400/20 bg-yellow-400/10 text-yellow-300";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${className}`}
    >
      {result}
    </span>
  );
}
type StatCardProps = {
  label: string;
  value: string;
  detail: string;
};

export default function StatCard({
  label,
  value,
  detail,
}: StatCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-xl">
      <p className="text-sm font-medium text-zinc-400">{label}</p>

      <p className="mt-4 text-4xl font-bold text-white">
        {value}
      </p>

      <p className="mt-2 text-sm text-zinc-500">
        {detail}
      </p>
    </div>
  );
}
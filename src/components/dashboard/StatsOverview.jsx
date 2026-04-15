function KpiCard({ label, value, tone = "purple" }) {
  const tones = {
    purple: "text-[#500088] bg-[rgba(80,0,136,0.08)]",
    gold: "text-[#855300] bg-[rgba(254,166,25,0.14)]",
    slate: "text-[#1c1c18] bg-[rgba(76,68,82,0.08)]",
  };

  return (
    <article className="bg-white rounded-2xl p-4 shadow-sm border border-[rgba(207,194,212,0.2)]">
      <p className="text-[#4c4452] text-xs font-semibold uppercase tracking-wide">{label}</p>
      <div className="mt-2 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold bg-[#f7f3ed] text-[#4c4452]">This month</div>
      <p className={`mt-3 inline-flex rounded-xl px-3 py-2 text-lg sm:text-xl font-extrabold ${tones[tone] || tones.purple}`}>
        Ksh {Number(value || 0).toLocaleString()}
      </p>
    </article>
  );
}

function ProgressRing({ progress }) {
  const safeProgress = Math.max(0, Math.min(Number(progress || 0), 100));
  const radius = 52;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (safeProgress / 100) * circumference;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120" className="shrink-0" aria-hidden="true">
      <circle cx="60" cy="60" r={normalizedRadius} fill="none" stroke="rgba(207,194,212,0.35)" strokeWidth={stroke} />
      <circle
        cx="60"
        cy="60"
        r={normalizedRadius}
        fill="none"
        stroke="url(#goalGradient)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform="rotate(-90 60 60)"
        className="transition-all duration-700"
      />
      <defs>
        <linearGradient id="goalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#500088" />
          <stop offset="100%" stopColor="#fea619" />
        </linearGradient>
      </defs>
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-[#1c1c18] text-2xl font-extrabold">
        {Math.round(safeProgress)}%
      </text>
    </svg>
  );
}

export default function StatsOverview({ goal, earned, remaining, progress }) {
  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[rgba(207,194,212,0.2)]" data-aos="fade-up">
      <div className="flex items-center justify-between gap-3 mb-5">
        <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#1c1c18] text-xl sm:text-2xl">Income Snapshot</h2>
        <span className="bg-[rgba(80,0,136,0.08)] text-[#500088] text-xs font-bold px-3 py-1 rounded-full">Dashboard KPIs</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <KpiCard label="Goal" value={goal} tone="gold" />
        <KpiCard label="Earned" value={earned} tone="purple" />
        <KpiCard label="Remaining" value={remaining} tone="slate" />
      </div>

      <div className="mt-5 rounded-2xl bg-[#f7f3ed] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <ProgressRing progress={progress} />
        <div className="min-w-0">
          <p className="text-[#4c4452] text-xs font-semibold uppercase tracking-wide">Goal completion</p>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[#1c1c18] font-extrabold text-lg sm:text-xl mt-1">You are {Math.round(progress)}% of the way there</p>
          <p className="text-[#4c4452] text-sm mt-1">Keep pushing. Small daily actions compound into serious monthly results.</p>
        </div>
      </div>
    </section>
  );
}

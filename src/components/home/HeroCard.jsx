const HeroCard = ({ user, totalCompleted, totalLessons }) => {
  const overallPct =
    totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#1a1f35] via-[#0f172a] to-[#1e1040] p-6">
      <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-5 h-36 w-36 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="relative">
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-sm font-bold text-slate-400 mb-1">Good day 👋</p>
            <h1 className="font-playfair text-3xl font-bold text-slate-100 leading-tight">
              {user?.name?.split(" ")[0]}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Fluency is closer than you think.
            </p>
          </div>
          <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-center">
            <p className="text-2xl font-black text-orange-400">
              🔥 {user?.streak || 0}
            </p>
            <p className="text-xs font-bold text-orange-500/70 mt-1">
              day streak
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            {
              label: "Total XP",
              value: user?.totalXP || 0,
              color: "text-yellow-400",
            },
            {
              label: "Completed",
              value: totalCompleted,
              color: "text-green-400",
            },
            {
              label: "Remaining",
              value: Math.max(0, totalLessons - totalCompleted),
              color: "text-blue-400",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-center"
            >
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs font-bold text-slate-500 mt-0.5">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div>
          <div className="flex justify-between text-sm font-bold mb-2">
            <span className="text-slate-500">Overall Progress</span>
            <span className="text-slate-400">
              {overallPct}% · {totalCompleted}/{totalLessons || "..."}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all duration-700"
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCard;

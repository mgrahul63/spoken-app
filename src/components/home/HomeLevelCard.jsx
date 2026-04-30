import { useNavigate } from "react-router-dom";
const HomeLevelCard = ({
  levelId,
  levelName,
  emoji,
  unlocked,
  style,
  pct,
  doneCount,
  days,
}) => {
  const TOTAL_SECTIONS = 8;
  const navigate = useNavigate();
  return (
    <div
      className={`rounded-2xl border bg-[#161b27] p-5 transition-all duration-300
                      ${unlocked ? style.card : "border-white/[0.06] opacity-50"}`}
    >
      {/* level header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl border text-xl ${style.iconBg} ${style.iconBorder}`}
          >
            {emoji}
          </div>
          <div>
            <p className="text-base font-extrabold text-slate-100">
              {levelName}
            </p>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              {unlocked
                ? `${pct}% complete · ${doneCount}/${days.length} days done`
                : "🔒 Finish previous level to unlock"}
            </p>
          </div>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-sm font-extrabold ${style.badge}`}
        >
          {pct}%
        </span>
      </div>

      {/* level progress bar */}
      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={`h-full rounded-full transition-all duration-700 ${style.bar}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* day cards — flex-col, count from backend */}
      <div className="flex flex-col gap-3">
        {days.map(
          ({ dayNum, isCompleted, inProgress, doneSections, dayLocked }) => (
            <button
              key={dayNum}
              disabled={dayLocked}
              onClick={() =>
                !dayLocked && navigate(`/lesson/${levelId}/${dayNum}`)
              }
              className={`group w-full rounded-xl border py-2 px-4 text-left transition-all duration-200
                            ${
                              isCompleted
                                ? "border-green-500/25 bg-green-500/[0.07] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-900/20"
                                : ""
                            }
                            ${
                              inProgress
                                ? `${style.card} ${style.iconBg} hover:-translate-y-0.5 hover:shadow-lg`
                                : ""
                            }
                            ${
                              !isCompleted && !inProgress && !dayLocked
                                ? "border-white/[0.07] bg-white/[0.02] hover:-translate-y-0.5 hover:border-white/20 hover:shadow-lg"
                                : ""
                            }
                            ${
                              dayLocked
                                ? "cursor-not-allowed border-white/[0.05] bg-white/[0.01] opacity-40"
                                : "cursor-pointer"
                            }
                          `}
            >
              <div className="flex items-center justify-between">
                {/* left */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xl
                                ${isCompleted ? "bg-green-500/15" : inProgress ? style.iconBg : "bg-white/[0.04]"}`}
                  >
                    {isCompleted
                      ? "✅"
                      : inProgress
                        ? "▶️"
                        : dayLocked
                          ? "🔒"
                          : "📅"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-extrabold text-slate-100">
                      Day {dayNum}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className={`h-full rounded-full transition-all duration-500
                                        ${isCompleted ? "bg-green-500" : style.bar}`}
                          style={{
                            width: `${(doneSections / TOTAL_SECTIONS) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-extrabold text-slate-500 whitespace-nowrap">
                        {doneSections}/{TOTAL_SECTIONS}
                      </span>
                    </div>
                  </div>
                </div>

                {/* right */}
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-extrabold whitespace-nowrap
                                ${isCompleted ? "bg-green-500/15 text-green-400" : ""}
                                ${inProgress ? style.badge : ""}
                                ${!isCompleted && !inProgress && !dayLocked ? "bg-white/[0.06] text-slate-500" : ""}
                                ${dayLocked ? "bg-white/[0.04] text-slate-600" : ""}
                              `}
                  >
                    {isCompleted
                      ? "✓ Done"
                      : inProgress
                        ? "In Progress"
                        : dayLocked
                          ? "Locked"
                          : "Start"}
                  </span>
                  {!dayLocked && (
                    <span className="text-lg text-slate-600 transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  )}
                </div>
              </div>
            </button>
          ),
        )}
      </div>
    </div>
  );
};

export default HomeLevelCard;

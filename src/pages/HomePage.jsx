import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLessons } from "../api";
import { useAuth } from "../context/AuthContext";
import { useProgress } from "../context/ProgressContext";

const LEVEL_STYLES = {
  0: {
    bar: "bg-green-500",
    iconBg: "bg-green-500/10",
    iconBorder: "border-green-500/30",
    badge: "bg-green-500/10 text-green-400 border-green-500/20",
    card: "border-green-500/20",
  },
  1: {
    bar: "bg-blue-500",
    iconBg: "bg-blue-500/10",
    iconBorder: "border-blue-500/30",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    card: "border-blue-500/20",
  },
  2: {
    bar: "bg-violet-500",
    iconBg: "bg-violet-500/10",
    iconBorder: "border-violet-500/30",
    badge: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    card: "border-violet-500/20",
  },
  3: {
    bar: "bg-amber-500",
    iconBg: "bg-amber-500/10",
    iconBorder: "border-amber-500/30",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    card: "border-amber-500/20",
  },
  4: {
    bar: "bg-pink-500",
    iconBg: "bg-pink-500/10",
    iconBorder: "border-pink-500/30",
    badge: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    card: "border-pink-500/20",
  },
};

const TOTAL_SECTIONS = 8;

export default function HomePage() {
  const { user } = useAuth();
  const { allProgress, fetchAllProgress } = useProgress();
  const navigate = useNavigate();

  // ✅ isLoading directly from TanStack Query — no extra useState needed
  const { data, isLoading: courseLoading } = useQuery({
    queryKey: ["courseData"],
    queryFn: getLessons,
  });

  // Backend shape: { summary: [{levelId, levelName, emoji, days}], totalDays: N }
  const courseData = data?.data ?? null;

  useEffect(() => {
    fetchAllProgress();
  }, []);

  // ── helpers ──────────────────────────────────────────────────────────────

  function getDaysForLevelId(levelId) {
    return courseData?.summary?.find((l) => l.levelId === levelId)?.days ?? 0;
  }

  function getProgress(levelId, day) {
    return (
      allProgress.find((p) => p.level === levelId && p.day === day) ?? null
    );
  }

  function isLevelUnlocked(levelId) {
    if (levelId === 0) return true;
    const prevDayCount = getDaysForLevelId(levelId - 1);
    if (prevDayCount === 0) return false;
    return Array.from({ length: prevDayCount }, (_, i) => i + 1).every(
      (d) => getProgress(levelId - 1, d)?.isCompleted,
    );
  }

  function levelPct(levelId) {
    const totalDays = getDaysForLevelId(levelId);
    if (totalDays === 0) return 0;
    const done = Array.from({ length: totalDays }, (_, i) =>
      getProgress(levelId, i + 1)?.isCompleted ? 1 : 0,
    ).reduce((a, b) => a + b, 0);
    return Math.round((done / totalDays) * 100);
  }

  function buildDays(levelId) {
    const totalDays = getDaysForLevelId(levelId);
    const unlocked = isLevelUnlocked(levelId);
    return Array.from({ length: totalDays }, (_, i) => {
      const dayNum = i + 1;
      const prog = getProgress(levelId, dayNum);
      const isCompleted = prog?.isCompleted ?? false;
      const inProgress = !!prog && !isCompleted;
      const doneSections = Object.values(prog?.completedSections || {}).filter(
        Boolean,
      ).length;
      const prevDone =
        dayNum === 1 ? true : !!getProgress(levelId, dayNum - 1)?.isCompleted;
      const dayLocked = !unlocked || !prevDone;
      return { dayNum, isCompleted, inProgress, doneSections, dayLocked };
    });
  }

  // ── derived values ────────────────────────────────────────────────────────

  const totalLessons = courseData?.totalDays ?? 0;
  const totalCompleted = allProgress.filter((p) => p.isCompleted).length;
  const overallPct =
    totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;
  const currentLevel = user?.currentLevel ?? 0;
  const roadmap = [...(courseData?.summary ?? [])].sort(
    (a, b) => a.levelId - b.levelId,
  );

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <div className="w-full max-w-4xl mx-auto px-3 py-6 space-y-4">
        {/* ── HERO CARD ── */}
        <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#1a1f35] via-[#0f172a] to-[#1e1040] p-6">
          <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-8 -left-5 h-36 w-36 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="relative">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-sm font-bold text-slate-400 mb-1">
                  Good day 👋
                </p>
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

        {/* ── ROADMAP ── */}
        {roadmap.length > 0 && (
          <div className="rounded-2xl border border-white/[0.07] bg-[#161b27] p-5">
            <p className="mb-4 text-xs font-extrabold uppercase tracking-widest text-slate-500">
              🗺️ Learning Roadmap
            </p>
            <div className="flex overflow-x-auto pb-1 scrollbar-hide">
              {roadmap.map((step, i) => {
                const isDone = step.levelId < currentLevel;
                const isActive = step.levelId === currentLevel;
                const isLocked = step.levelId > currentLevel;
                return (
                  <div
                    key={step.levelId}
                    className="relative flex min-w-[88px] flex-col items-center"
                  >
                    {i < roadmap.length - 1 && (
                      <div
                        className={`absolute left-[58%] top-[18px] z-0 h-0.5 w-[calc(100%-12px)] transition-colors duration-500
                        ${isDone ? "bg-indigo-500" : "bg-white/[0.07]"}`}
                      />
                    )}
                    <div
                      className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 text-base transition-all duration-300
                      ${isDone ? "border-indigo-500 bg-indigo-500 text-white text-sm font-bold" : ""}
                      ${isActive ? "border-pink-500 bg-pink-500/10 shadow-[0_0_0_4px_rgba(236,72,153,0.15)]" : ""}
                      ${isLocked ? "border-white/10 bg-white/[0.03] opacity-40" : ""}
                    `}
                    >
                      {isDone ? "✓" : step.emoji}
                    </div>
                    <p
                      className={`mt-1.5 max-w-[80px] text-center text-xs font-bold leading-tight
                      ${isDone ? "text-indigo-400" : isActive ? "text-pink-400" : "text-slate-600"}`}
                    >
                      {step.levelName}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── ALL LESSONS ── */}
        <div>
          <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-slate-500">
            📚 All Lessons
          </p>

          {/* skeleton */}
          {courseLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="rounded-2xl border border-white/[0.06] bg-[#161b27] p-5 animate-pulse"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-11 w-11 rounded-xl bg-white/[0.06]" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-28 rounded-lg bg-white/[0.06]" />
                      <div className="h-3 w-40 rounded-lg bg-white/[0.04]" />
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/[0.06] mb-4" />
                  <div className="space-y-3">
                    <div className="h-16 w-full rounded-xl bg-white/[0.04]" />
                    <div className="h-16 w-full rounded-xl bg-white/[0.04]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* level cards */}
          {!courseLoading && (
            <div className="space-y-4">
              {roadmap.map((backendLvl) => {
                const { levelId, levelName, emoji } = backendLvl;
                const style = LEVEL_STYLES[levelId] ?? LEVEL_STYLES[0];
                const unlocked = isLevelUnlocked(levelId);
                const pct = levelPct(levelId);
                const days = buildDays(levelId);
                const doneCount = days.filter((d) => d.isCompleted).length;

                return (
                  <div
                    key={levelId}
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
                        ({
                          dayNum,
                          isCompleted,
                          inProgress,
                          doneSections,
                          dayLocked,
                        }) => (
                          <button
                            key={dayNum}
                            disabled={dayLocked}
                            onClick={() =>
                              !dayLocked &&
                              navigate(`/lesson/${levelId}/${dayNum}`)
                            }
                            className={`group w-full rounded-xl border p-4 text-left transition-all duration-200
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
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

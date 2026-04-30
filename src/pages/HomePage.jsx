import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLessons } from "../api";
import HeroCard from "../components/home/HeroCard";
import HomeLevelCard from "../components/home/HomeLevelCard";
import Roadmap from "../components/home/Roadmap";
import Selecton from "../components/home/Selecton";
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
        <HeroCard
          user={user}
          totalCompleted={totalCompleted}
          totalLessons={totalLessons}
        />

        {/* ── ROADMAP ── */}
        {roadmap.length > 0 && (
          <Roadmap roadmap={roadmap} currentLevel={currentLevel} />
        )}

        {/* ── ALL LESSONS ── */}
        <div>
          <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-slate-500">
            📚 All Lessons
          </p>

          {/* skeleton */}
          {courseLoading && <Selecton />}

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
                  <HomeLevelCard
                    key={levelId}
                    levelId={levelId}
                    levelName={levelName}
                    emoji={emoji}
                    unlocked={unlocked}
                    style={style}
                    pct={pct}
                    doneCount={doneCount}
                    days={days}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

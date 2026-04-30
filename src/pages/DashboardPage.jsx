import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOverviewStats } from "../api/index.js";
import { useAuth } from "../context/AuthContext";
import { useProgress } from "../context/ProgressContext";

const SECTION_LABELS = {
  vocabulary: "Vocabulary",
  phrases: "Phrases",
  sentences: "Sentences",
  quiz: "Quiz",
  story: "Story",
  listening: "Listening",
  speaking: "Speaking",
  conversation: "Conversation",
};

const SECTION_ICONS = {
  vocabulary: "📝",
  phrases: "💬",
  sentences: "✍️",
  quiz: "🧩",
  story: "📖",
  listening: "🎧",
  speaking: "🎤",
  conversation: "🤝",
};

const LEVEL_NAMES = [
  "Beginner",
  "Elementary",
  "Intermediate",
  "Upper-Inter.",
  "Advanced",
];
const LEVEL_EMOJIS = ["🌱", "📖", "🗣️", "📡", "🏆"];

const LEVEL_STYLES = [
  {
    banner: "bg-emerald-500/10 border-emerald-500/25",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  {
    banner: "bg-sky-500/10 border-sky-500/25",
    text: "text-sky-400",
    dot: "bg-sky-400",
  },
  {
    banner: "bg-violet-500/10 border-violet-500/25",
    text: "text-violet-400",
    dot: "bg-violet-400",
  },
  {
    banner: "bg-amber-500/10 border-amber-500/25",
    text: "text-amber-400",
    dot: "bg-amber-400",
  },
  {
    banner: "bg-pink-500/10 border-pink-500/25",
    text: "text-pink-400",
    dot: "bg-pink-400",
  },
];

// ── Sub-components ───────────────────────────────────────────────────────────

const SectionPill = ({ sectionKey, done }) => (
  <span
    className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border
    ${
      done
        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
        : "bg-white/5 border-white/10 text-slate-500"
    }`}
  >
    {done && <span className="text-[9px]">✓</span>}
    <span>{SECTION_ICONS[sectionKey]}</span>
    {SECTION_LABELS[sectionKey]}
  </span>
);

const LessonCard = ({ p, onNavigate, variant }) => {
  const isCompleted = variant === "completed";
  const done = Object.values(p.completedSections || {}).filter(Boolean).length;
  const pct = Math.round((done / 8) * 100);

  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 flex flex-col gap-3 hover:bg-white/[0.06] transition-colors">
      {/* header row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full border
            ${
              isCompleted
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-sky-500/10 border-sky-500/30 text-sky-400"
            }`}
          >
            {LEVEL_NAMES[p.level]} · Day {p.day}
          </span>
          {p.xpEarned > 0 && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
              +{p.xpEarned} XP
            </span>
          )}
        </div>
        <button
          onClick={() => onNavigate(`/lesson/${p.level}/${p.day}`)}
          className="text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors whitespace-nowrap shrink-0"
        >
          {isCompleted ? "Review →" : "Continue →"}
        </button>
      </div>

      {/* progress bar — in-progress only */}
      {!isCompleted && (
        <div className="flex flex-col gap-1">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs text-slate-500">
            {done} of 8 sections · {pct}% complete
          </span>
        </div>
      )}

      {/* section pills */}
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(p.completedSections || {}).map(([k, v]) =>
          isCompleted ? (
            v ? (
              <SectionPill key={k} sectionKey={k} done />
            ) : null
          ) : (
            <SectionPill key={k} sectionKey={k} done={v} />
          ),
        )}
      </div>
    </div>
  );
};

// ── Page ─────────────────────────────────────────────────────────────────────

const DashboardPage = () => {
  const { user } = useAuth();
  const { allProgress, fetchAllProgress } = useProgress();
  const navigate = useNavigate();

  // ✅ TanStack Query for overview stats API call
  const { data: statsData } = useQuery({
    queryKey: ["overviewStats"],
    queryFn: getOverviewStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const stats = statsData?.data ?? null;

  // ✅ Context function — kept in useEffect (not converted to Query)
  useEffect(() => {
    fetchAllProgress();
  }, []);

  const completed = allProgress.filter((p) => p.isCompleted);
  const inProgress = allProgress.filter(
    (p) =>
      !p.isCompleted && Object.values(p.completedSections || {}).some(Boolean),
  );

  const level = user?.currentLevel || 0;
  const levelStyle = LEVEL_STYLES[level] ?? LEVEL_STYLES[0];

  const statCards = [
    {
      icon: "⚡",
      label: "Total XP",
      value: (user?.totalXP || 0).toLocaleString(),
      color: "text-violet-400",
      bg: "bg-violet-500/10 border-violet-500/20",
    },
    {
      icon: "🔥",
      label: "Day streak",
      value: `${user?.streak || 0}d`,
      color: "text-orange-400",
      bg: "bg-orange-500/10 border-orange-500/20",
    },
    {
      icon: "✅",
      label: "Completed",
      value: completed.length,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      icon: "▶️",
      label: "In progress",
      value: inProgress.length,
      color: "text-sky-400",
      bg: "bg-sky-500/10 border-sky-500/20",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* ── Page header ── */}
      <div>
        <h1 className="text-xl font-semibold text-slate-100 mb-0.5">
          My progress
        </h1>
        <p className="text-sm text-slate-400">
          Track your English learning journey
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {statCards.map((s, i) => (
          <div
            key={i}
            className={`${s.bg} border rounded-xl p-3.5 flex flex-col gap-1.5`}
          >
            <span className="text-lg leading-none">{s.icon}</span>
            <span className={`text-xl font-semibold leading-none ${s.color}`}>
              {s.value}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Current level ── */}
      <div
        className={`${levelStyle.banner} border rounded-2xl p-4 flex items-center gap-4`}
      >
        <span className="text-3xl leading-none">{LEVEL_EMOJIS[level]}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-400 font-medium mb-0.5">
            Current level
          </p>
          <h2
            className={`text-base font-semibold leading-tight ${levelStyle.text}`}
          >
            {LEVEL_NAMES[level]}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete more lessons to level up
          </p>
        </div>
        {/* level dots */}
        <div className="flex items-center gap-1 shrink-0">
          {LEVEL_NAMES.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all
              ${i < level ? `w-2 h-2 ${levelStyle.dot}` : ""}
              ${i === level ? `w-2.5 h-2.5 ${levelStyle.dot}` : ""}
              ${i > level ? "w-1.5 h-1.5 bg-white/15" : ""}
            `}
            />
          ))}
        </div>
      </div>

      {/* ── In progress ── */}
      {inProgress.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold text-slate-200">
              In progress
            </h2>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
              {inProgress.length}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {inProgress.map((p) => (
              <LessonCard
                key={p._id}
                p={p}
                onNavigate={navigate}
                variant="inProgress"
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Completed ── */}
      {completed.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold text-slate-200">
              Completed lessons
            </h2>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
              {completed.length}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {completed.map((p) => (
              <LessonCard
                key={p._id}
                p={p}
                onNavigate={navigate}
                variant="completed"
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {allProgress.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <span className="text-5xl">📚</span>
          <div>
            <h3 className="text-base font-semibold text-slate-200 mb-1">
              No lessons started yet
            </h3>
            <p className="text-sm text-slate-400">
              Start your first lesson to see your progress here
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="mt-2 text-sm font-semibold px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 transition-colors"
          >
            Go to lessons →
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;

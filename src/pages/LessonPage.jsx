import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getLessonByLevelAndDay } from "../api";
import ConversationSection from "../components/lesson/ConversationSection";
import ListeningSection from "../components/lesson/ListeningSection";
import PhrasesSection from "../components/lesson/PhrasesSection";
import ProgressBar from "../components/lesson/ProgressBar";
import QuizSection from "../components/lesson/QuizSection";
import SentencesSection from "../components/lesson/SentencesSection";
import SpeakingSection from "../components/lesson/SpeakingSection";
import StorySection from "../components/lesson/StorySection";
import VocabSection from "../components/lesson/VocabSection";
import { useProgress } from "../context/ProgressContext";

const TABS = [
  { id: "vocabulary", label: "📚 Vocab", lockedBy: null },
  { id: "phrases", label: "💬 Phrases", lockedBy: "vocabulary" },
  { id: "sentences", label: "✍️ Sentences", lockedBy: "phrases" },
  { id: "quiz", label: "❓ Quiz", lockedBy: "sentences" },
  { id: "story", label: "📖 Story", lockedBy: "quiz" },
  { id: "listening", label: "🎧 Listening", lockedBy: "story" },
  { id: "speaking", label: "🎤 Speaking", lockedBy: "listening" },
  { id: "conversation", label: "🗣️ Convo", lockedBy: "speaking" },
];

const LessonPage = () => {
  const { levelId, day } = useParams();
  const navigate = useNavigate();
  const {
    fetchLessonProgress,
    markSection,
    currentProgress,
    setCurrentProgress,
  } = useProgress();

  const [activeTab, setActiveTab] = useState("vocabulary");

  const lessonId = `L${levelId}D${day}`;

  // ✅ TanStack Query for lesson data
  const {
    data: lessonData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lesson", levelId, day],
    queryFn: () => getLessonByLevelAndDay(levelId, day),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const lesson = lessonData?.data ?? null;

  // ✅ Context functions called in useEffect (not converted to Query)
  useEffect(() => {
    fetchLessonProgress(lessonId);
    setActiveTab("vocabulary");
    return () => setCurrentProgress(null);
  }, [levelId, day]);

  const sections = currentProgress?.completedSections || {};
  const allDone = TABS.every((t) => sections[t.id]);
  const completedCount = TABS.filter((t) => sections[t.id]).length;

  async function handleMarkDone(sectionId, quizScore) {
    await markSection(
      lessonId,
      parseInt(levelId),
      parseInt(day),
      sectionId,
      quizScore,
    );
    toast.success(
      `✓ ${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)} completed!`,
    );
    const idx = TABS.findIndex((t) => t.id === sectionId);
    if (idx < TABS.length - 1) setActiveTab(TABS[idx + 1].id);
  }

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f0d1a]">
        <div className="text-center space-y-3">
          <div className="text-4xl animate-bounce">📚</div>
          <p className="text-slate-500 text-xs font-semibold tracking-widest uppercase">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // ── Error / not found state ──
  if (isError || !lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f0d1a]">
        <div className="text-center space-y-3">
          <div className="text-4xl">😕</div>
          <p className="text-slate-500 text-sm">Lesson not found.</p>
          <button
            onClick={() => navigate("/")}
            className="text-xs text-violet-400 hover:underline font-semibold"
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100">
      <div className="w-full max-w-4xl mx-auto px-3 sm:px-5 md:px-8 py-6 flex flex-col gap-5">
        {/* ── Header ── */}
        <div className="flex items-start gap-3">
          <button
            onClick={() => navigate("/")}
            className="mt-1 text-xs font-semibold text-slate-500 hover:text-violet-400 transition-colors flex items-center gap-1 shrink-0"
          >
            ← Back
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white leading-tight truncate">
              {lesson.topic}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {lesson.levelName} · Day {day}
            </p>
          </div>
          {allDone && (
            <span className="shrink-0 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-3 py-1.5 rounded-full">
              🏆 Complete
            </span>
          )}
        </div>

        {/* ── Progress ── */}
        <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-400 font-medium">Progress</span>
            <span className="text-xs font-bold text-violet-400">
              {completedCount}/{TABS.length}
            </span>
          </div>
          <ProgressBar completedSections={sections} />
        </div>

        {/* ── All done banner ── */}
        {allDone && (
          <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">🏆</div>
            <h2 className="text-lg font-bold text-white mb-1">Day Complete!</h2>
            <p className="text-sm text-slate-400 mb-4">
              You've finished all sections for today!
            </p>
            <span className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-3 py-1.5 rounded-full">
              +50 XP Earned 🎉
            </span>
            <div className="mt-4">
              <button
                onClick={() => {
                  navigate(`/lesson/${levelId}/${parseInt(day) + 1}`);
                  setActiveTab("vocabulary");
                }}
                className="text-xs text-slate-400 hover:text-violet-400 font-semibold transition-colors underline underline-offset-2"
              >
                Next Day →
              </button>
            </div>
          </div>
        )}

        {/* ── Tab panel ── */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden flex flex-col">
          {/* Tab strip */}
          <div className="flex overflow-x-auto scrollbar-hide border-b border-white/[0.07] bg-white/[0.02] px-2 pt-2 gap-0.5">
            {TABS.map((tab) => {
              const isLocked = tab.lockedBy && !sections[tab.lockedBy];
              const isDone = sections[tab.id];
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  disabled={isLocked}
                  onClick={() => !isLocked && setActiveTab(tab.id)}
                  title={isLocked ? `Complete ${tab.lockedBy} first` : ""}
                  className={[
                    "shrink-0 px-3.5 py-2 mb-[-1px] text-xs font-semibold rounded-t-lg border-b-2 transition-all duration-150 whitespace-nowrap",
                    isActive
                      ? "bg-violet-500/15 border-violet-400 text-violet-200"
                      : "",
                    isDone && !isActive
                      ? "border-transparent text-emerald-400 hover:bg-emerald-500/10"
                      : "",
                    isLocked
                      ? "border-transparent text-slate-700 cursor-not-allowed"
                      : "",
                    !isActive && !isDone && !isLocked
                      ? "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5 cursor-pointer"
                      : "",
                  ].join(" ")}
                >
                  {tab.label}
                  {isDone && !isActive ? " ✓" : ""}
                  {isLocked ? " 🔒" : ""}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 260px)" }}
          >
            <div className="p-5">
              {activeTab === "vocabulary" && lesson.vocabulary && (
                <VocabSection
                  vocab={lesson.vocabulary}
                  onDone={() => handleMarkDone("vocabulary")}
                  done={!!sections.vocabulary}
                />
              )}
              {activeTab === "phrases" && lesson.phrases && (
                <PhrasesSection
                  phrases={lesson.phrases}
                  onDone={() => handleMarkDone("phrases")}
                  done={!!sections.phrases}
                />
              )}
              {activeTab === "sentences" && lesson.sentences && (
                <SentencesSection
                  sentences={lesson.sentences}
                  onDone={() => handleMarkDone("sentences")}
                  done={!!sections.sentences}
                />
              )}
              {activeTab === "quiz" && lesson.quiz && (
                <QuizSection
                  questions={lesson.quiz}
                  onDone={(s) => handleMarkDone("quiz", s)}
                  done={!!sections.quiz}
                />
              )}
              {activeTab === "story" && lesson.story && (
                <StorySection
                  story={lesson.story}
                  onDone={() => handleMarkDone("story")}
                  done={!!sections.story}
                />
              )}
              {activeTab === "listening" && lesson.listening && (
                <ListeningSection
                  listening={lesson.listening}
                  onDone={() => handleMarkDone("listening")}
                  done={!!sections.listening}
                />
              )}
              {activeTab === "speaking" && lesson.speaking && (
                <SpeakingSection
                  speaking={lesson.speaking}
                  onDone={() => handleMarkDone("speaking")}
                  done={!!sections.speaking}
                />
              )}
              {activeTab === "conversation" && lesson.conversation && (
                <ConversationSection
                  conversation={lesson.conversation}
                  onDone={() => handleMarkDone("conversation")}
                  done={!!sections.conversation}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;

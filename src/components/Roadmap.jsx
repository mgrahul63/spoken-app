import { useNavigate } from "react-router-dom";

const ROADMAP = [
  { id: 0, name: "Beginner", emoji: "🌱", days: 2 },
  { id: 1, name: "Elementary", emoji: "📖", days: 2 },
  { id: 2, name: "Intermediate", emoji: "🗣️", days: 2 },
  { id: 3, name: "Upper-Inter.", emoji: "📡", days: 2 },
  { id: 4, name: "Advanced", emoji: "🏆", days: 2 },
];

export default function Roadmap({ currentLevel, allProgress }) {
  const navigate = useNavigate();

  function getLevelProgress(levelId) {
    const levelLessons = allProgress.filter((p) => p.level === levelId);
    const completed = levelLessons.filter((p) => p.isCompleted).length;
    return { completed, total: ROADMAP[levelId]?.days || 2 };
  }

  return (
    <div className="bg-[#221f35] rounded-2xl border border-gray-700 hover:shadow-md transition shadow-sm p-5 mb-4">
      <h2 className="text-sm font-extrabold mb-5 flex items-center gap-2">
        🗺️ Your Learning Roadmap
      </h2>
      <div className="flex overflow-x-auto pb-2 scrollbar-hide">
        {ROADMAP.map((step, i) => {
          const isDone = i < currentLevel;
          const isActive = i === currentLevel;
          const isLocked = i > currentLevel;
          const prog = getLevelProgress(step.id);

          return (
            <div
              key={step.id}
              className="flex flex-col items-center min-w-[100px] relative"
            >
              {i < ROADMAP.length - 1 && (
                <div
                  className={`absolute top-5 left-[60%] w-[calc(100%-16px)] h-0.5 z-0 transition-colors duration-500 ${isDone ? "bg-blue-900" : "bg-slate-200"}`}
                />
              )}
              <button
                disabled={isLocked}
                onClick={() => !isLocked && navigate(`/lesson/${step.id}/1`)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 relative z-10 transition-all duration-200
                  ${isDone ? "bg-blue-900 border-blue-900 text-white text-sm" : ""}
                  ${isActive ? "bg-white border-pink-500 shadow-[0_0_0_5px_rgba(232,67,147,0.12)]" : ""}
                  ${isLocked ? " border-slate-200 opacity-40 cursor-not-allowed" : "cursor-pointer hover:scale-105"}`}
              >
                {isDone ? "✓" : step.emoji}
              </button>
              <p
                className={`text-[11px] font-bold mt-1.5 text-center leading-tight max-w-[90px]
                ${isDone ? "text-blue-900" : isActive ? "text-pink-500" : "text-slate-300"}`}
              >
                {step.name}
              </p>
              {(isDone || isActive) && (
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {prog.completed}/{prog.total} done
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

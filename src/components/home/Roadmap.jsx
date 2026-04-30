import React from 'react'

const Roadmap = ({ roadmap, currentLevel }) => {
  return (
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
  )
}

export default Roadmap
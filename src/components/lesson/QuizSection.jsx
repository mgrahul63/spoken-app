import { useState } from "react";

export default function QuizSection({ questions, onDone, done }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[idx];

  function pick(i) {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.ans) setScore((s) => s + 1);
    setTimeout(() => {
      if (idx + 1 < questions.length) {
        setIdx((x) => x + 1);
        setSelected(null);
      } else setFinished(true);
    }, 1400);
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">{pct >= 75 ? "🎉" : "💪"}</div>
        <h3 className="text-xl font-bold text-white mb-1">Quiz Complete!</h3>
        <p className="text-slate-400 text-sm mb-4">
          Score:{" "}
          <strong className="text-violet-400">
            {score}/{questions.length}
          </strong>{" "}
          ({pct}%)
        </p>
        <div className="w-full h-2 bg-white/[0.07] rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full transition-all duration-1000"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p
          className={`text-sm font-semibold ${pct >= 75 ? "text-emerald-400" : "text-pink-400"}`}
        >
          {pct >= 75
            ? "Excellent! You're mastering it! 🌟"
            : "Keep practicing! You'll get it! 💪"}
        </p>
        {!done ? (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => onDone(score)}
              className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-violet-900/30"
            >
              Continue →
            </button>
          </div>
        ) : (
          <p className="text-emerald-400 font-semibold text-sm mt-4">
            ✓ Quiz completed!
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
          Question {idx + 1} / {questions.length}
        </p>
        <p className="text-xs font-bold text-violet-400">Score: {score}</p>
      </div>

      <div className="w-full h-1 bg-white/[0.07] rounded-full mb-5 overflow-hidden">
        <div
          className="h-full bg-violet-500 rounded-full transition-all duration-300"
          style={{ width: `${(idx / questions.length) * 100}%` }}
        />
      </div>

      <p className="text-base font-bold text-white mb-5 leading-relaxed">
        {q.q}
      </p>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {q.opts.map((opt, i) => {
          let cls =
            "text-left px-4 py-3 rounded-xl text-sm font-semibold border transition-all duration-200 ";
          if (selected === null)
            cls +=
              "bg-white/[0.03] border-white/[0.07] text-slate-300 hover:border-violet-500/50 hover:bg-violet-500/10 cursor-pointer";
          else if (i === q.ans)
            cls += "bg-emerald-500/15 border-emerald-500/50 text-emerald-300";
          else if (i === selected)
            cls += "bg-red-500/15 border-red-500/50 text-red-300";
          else
            cls +=
              "bg-white/[0.02] border-white/[0.04] text-slate-600 opacity-50";
          return (
            <button
              key={i}
              className={cls}
              onClick={() => pick(i)}
              disabled={selected !== null}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div
          className={`text-sm font-semibold px-4 py-3 rounded-xl border ${
            selected === q.ans
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
              : "bg-red-500/10 border-red-500/20 text-red-300"
          }`}
        >
          {selected === q.ans ? "✓ Correct! " : `✗ Correct: ${q.opts[q.ans]}. `}
          <span className="font-normal text-slate-400">{q.explanation}</span>
        </div>
      )}
    </div>
  );
}

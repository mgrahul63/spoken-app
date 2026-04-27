import { useState } from "react";
import { useTTS } from "../../hooks/useSpeech";

export default function StorySection({ story, onDone, done }) {
  const { speak, stop, speaking } = useTTS();
  const [showComp, setShowComp] = useState(false);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);

  function togglePlay() {
    if (speaking) stop();
    else speak(story.body.replace(/\n/g, " "), 0.9);
  }

  const allCorrect = story.comprehension?.every((q, i) => answers[i] === q.ans);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white">{story.title}</h3>
        <button
          onClick={togglePlay}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200
            ${
              speaking
                ? "bg-violet-600 border-violet-500 text-white"
                : "bg-white/[0.04] border-white/[0.08] text-slate-400 hover:border-violet-500/40 hover:text-violet-300"
            }`}
        >
          {speaking ? "⏹ Stop" : "🔊 Listen"}
        </button>
      </div>

      {/* Story body */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 text-sm text-slate-300 leading-8 space-y-1">
        {story.body
          .split("\n")
          .map((p, i) => (p.trim() ? <p key={i}>{p}</p> : <br key={i} />))}
      </div>

      {/* Tags */}
      {story.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {story.tags.map((t, i) => (
            <span
              key={i}
              className="text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-lg"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Comprehension */}
      {story.comprehension && (
        <div className="border-t border-white/[0.06] pt-4">
          <button
            onClick={() => setShowComp((s) => !s)}
            className="text-xs font-semibold text-slate-400 hover:text-violet-300 transition-colors mb-3"
          >
            {showComp ? "▲ Hide" : "▼ Show"} Comprehension Questions
          </button>
          {showComp && (
            <div className="space-y-4">
              {story.comprehension.map((cq, i) => (
                <div key={i}>
                  <p className="text-sm font-semibold text-white mb-2">
                    {i + 1}. {cq.q}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {cq.opts.map((opt, j) => {
                      let cls =
                        "text-left px-3 py-2 rounded-lg text-xs font-semibold border transition-all duration-150 ";
                      if (!checked)
                        cls +=
                          answers[i] === j
                            ? "border-violet-500/50 bg-violet-500/15 text-violet-300"
                            : "border-white/[0.07] bg-white/[0.03] text-slate-400 hover:border-violet-500/30 cursor-pointer";
                      else if (j === cq.ans)
                        cls +=
                          "border-emerald-500/50 bg-emerald-500/10 text-emerald-300";
                      else if (answers[i] === j)
                        cls += "border-red-500/50 bg-red-500/10 text-red-300";
                      else
                        cls +=
                          "border-white/[0.05] bg-white/[0.02] text-slate-600 opacity-50";
                      return (
                        <button
                          key={j}
                          className={cls}
                          onClick={() =>
                            !checked && setAnswers((a) => ({ ...a, [i]: j }))
                          }
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              {!checked &&
                Object.keys(answers).length === story.comprehension.length && (
                  <button
                    onClick={() => setChecked(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-all"
                  >
                    Check Answers
                  </button>
                )}
              {checked && (
                <p
                  className={`text-sm font-semibold ${allCorrect ? "text-emerald-400" : "text-orange-400"}`}
                >
                  {allCorrect
                    ? "🎉 All correct! Great reading!"
                    : "📖 Review the story and try again!"}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {!done ? (
        <div className="flex justify-end">
          <button
            onClick={onDone}
            className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-violet-900/30"
          >
            Mark as Done ✓
          </button>
        </div>
      ) : (
        <p className="text-right text-emerald-400 font-semibold text-sm">
          ✓ Story completed!
        </p>
      )}
    </div>
  );
}

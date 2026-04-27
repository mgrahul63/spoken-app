import { useState } from "react";
import { useTTS } from "../../hooks/useSpeech";

export default function ListeningSection({ listening, onDone, done }) {
  const { speak, stop, speaking } = useTTS();
  const [showScript, setShowScript] = useState(false);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-white">🎧 {listening.title}</h3>

      {/* Player card */}
      <div className="bg-gradient-to-br from-indigo-900/40 to-violet-900/30 border border-indigo-500/20 rounded-xl p-5 text-center">
        <div className="text-4xl mb-3">{speaking ? "🔊" : "🎙️"}</div>
        <p className="text-xs text-slate-400 font-medium mb-4">
          {speaking
            ? "Playing audio..."
            : "Click play to listen to the conversation"}
        </p>
        <div className="flex justify-center gap-2">
          <button
            onClick={() =>
              speaking
                ? stop()
                : speak(listening.script.replace(/\n/g, " "), 0.88)
            }
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200
              ${
                speaking
                  ? "bg-violet-600 border-violet-500 text-white"
                  : "bg-white/[0.06] border-white/[0.10] text-slate-300 hover:border-violet-500/50 hover:bg-violet-500/10"
              }`}
          >
            {speaking ? "⏹ Stop" : "▶ Play Audio"}
          </button>
          <button
            onClick={() => setShowScript((s) => !s)}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold border bg-white/[0.04] border-white/[0.08] text-slate-400 hover:border-white/20 transition-all"
          >
            {showScript ? "🙈 Hide" : "👁 Script"}
          </button>
        </div>
      </div>

      {/* Script */}
      <div
        className={`transition-all duration-300 overflow-hidden ${showScript ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 text-sm text-slate-300 leading-8 space-y-1">
          {listening.script
            .split("\n")
            .map((line, i) =>
              line.trim() ? <p key={i}>{line}</p> : <br key={i} />,
            )}
        </div>
      </div>

      {/* Comprehension */}
      {listening.comprehension && (
        <div className="border-t border-white/[0.06] pt-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            Comprehension Check
          </p>
          <div className="space-y-4">
            {listening.comprehension.map((cq, i) => (
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
              Object.keys(answers).length ===
                listening.comprehension.length && (
                <button
                  onClick={() => setChecked(true)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-all"
                >
                  Check Answers
                </button>
              )}
          </div>
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
          ✓ Listening completed!
        </p>
      )}
    </div>
  );
}

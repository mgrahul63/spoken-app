import { useState } from "react";
import SpeakBtn from "../SpeakBtn";

export default function VocabSection({ vocab, onDone, done }) {
  const [revealed, setRevealed] = useState({});

  return (
    <div className="space-y-3">
      <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest mb-4">
        👁 Reveal Bangla · 🔊 Hear pronunciation
      </p>

      <div className="space-y-2.5">
        {vocab.map((v, i) => (
          <div
            key={i}
            className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 hover:border-violet-500/30 hover:bg-white/[0.05] transition-all duration-200"
          >
            <div className="flex items-start gap-3">
              <SpeakBtn text={v.word} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-lg font-bold text-white">{v.word}</span>
                  <span className="text-xs font-mono text-slate-500 bg-white/[0.05] px-2 py-0.5 rounded-md">
                    {v.phonetic}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mt-0.5">{v.meaning}</p>

                <button
                  onClick={() => setRevealed((r) => ({ ...r, [i]: !r[i] }))}
                  className="mt-2 text-[11px] text-violet-400 font-semibold hover:text-violet-300 transition-colors flex items-center gap-1"
                >
                  {revealed[i] ? "🙈 Hide Bangla" : "👁 Show Bangla"}
                </button>
                {revealed[i] && (
                  <div className="mt-1.5 text-sm font-semibold text-pink-300 bg-pink-500/10 border border-pink-500/20 px-3 py-1.5 rounded-lg">
                    {v.bangla}
                  </div>
                )}

                <div className="mt-3 flex items-start gap-2">
                  <SpeakBtn text={v.example} size="sm" />
                  <div>
                    <p className="text-xs text-slate-400 italic">
                      "{v.example}"
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {v.exampleBn}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!done ? (
        <div className="flex justify-end mt-5">
          <button
            onClick={onDone}
            className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-violet-900/30"
          >
            Mark as Done ✓
          </button>
        </div>
      ) : (
        <p className="text-right text-emerald-400 font-semibold text-sm mt-4">
          ✓ Vocabulary completed!
        </p>
      )}
    </div>
  );
}

import SpeakBtn from "../SpeakBtn";

export default function SentencesSection({ sentences, onDone, done }) {
  return (
    <div className="space-y-2.5">
      {sentences.map((s, i) => (
        <div
          key={i}
          className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 flex items-start justify-between gap-3 hover:border-violet-500/30 hover:bg-white/[0.05] transition-all duration-200"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">{s.en}</p>
            <p className="text-xs text-slate-500 mt-1">{s.bn}</p>
          </div>
          <SpeakBtn text={s.en} />
        </div>
      ))}

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
          ✓ Sentences completed!
        </p>
      )}
    </div>
  );
}

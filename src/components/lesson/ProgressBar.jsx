const SECTIONS = [
  "vocabulary",
  "phrases",
  "sentences",
  "quiz",
  "story",
  "listening",
  "speaking",
  "conversation",
];
const LABELS = {
  vocabulary: "📝 Vocab",
  phrases: "💬 Phrases",
  sentences: "✍️ Sentences",
  quiz: "🧩 Quiz",
  story: "📖 Story",
  listening: "🎧 Listening",
  speaking: "🎤 Speaking",
  conversation: "🤝 Conversation",
};

export default function ProgressBar({ completedSections = {} }) {
  const done = SECTIONS.filter((s) => completedSections[s]).length;
  const pct = Math.round((done / SECTIONS.length) * 100);

  return (
    <div className="bg-[#221f35] border border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transitionrounded-2xl mb-4">
      <div className="flex justify-between text-xs font-bold text-gray-200 mb-2">
        <span>📊 Today's Progress</span>
        <span>
          {pct}% · {done}/{SECTIONS.length} tasks
        </span>
      </div>

      {/* Progress Bar Wrapper */}
      <div className="relative h-6 bg-slate-100 rounded-full overflow-hidden border border-gray-700">
        {/* Filled Progress */}
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-900 to-pink-500 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />

        {/* Section Labels Overlay */}
        {SECTIONS.map((s, i) => {
          const position = ((i + 0.5) / SECTIONS.length) * 100;

          return (
            <div
              key={s}
              className="absolute top-1/2 -translate-y-1/2 text-[9px] font-bold whitespace-nowrap"
              style={{
                left: `${position}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <span
                className={`px-1.5 py-0.5 rounded
            ${completedSections[s] ? "text-white" : "text-slate-500"}`}
              >
                {LABELS[s]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

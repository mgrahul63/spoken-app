const SYNONYM_STYLES = [
  "bg-rose-500/10 border-rose-500/25 text-rose-400",
  "bg-sky-500/10 border-sky-500/25 text-sky-400",
  "bg-emerald-500/10 border-emerald-500/25 text-emerald-400",
  "bg-violet-500/10 border-violet-500/25 text-violet-400",
  "bg-amber-500/10 border-amber-500/25 text-amber-400",
  "bg-pink-500/10 border-pink-500/25 text-pink-400",
  "bg-blue-500/10 border-blue-500/25 text-blue-400",
  "bg-teal-500/10 border-teal-500/25 text-teal-400",
  "bg-purple-500/10 border-purple-500/25 text-purple-400",
];

const Synonyms = ({ synonyms }) => {
  if (!synonyms?.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {synonyms.map((synonym, i) => (
        <span
          key={i}
          className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${SYNONYM_STYLES[i % SYNONYM_STYLES.length]}`}
        >
          {synonym}
        </span>
      ))}
    </div>
  );
};

export default Synonyms;

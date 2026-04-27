import ExampleItem from "./ExampleItem";
import SpeakBtn from "./SpeakBtn";
import Synonyms from "./Synonyms";

const VerbCard = ({ verb, onSelect }) => {
  return (
    <div className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4 hover:bg-white/[0.06] transition-colors">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* ── Left: word info ── */}
        <div className="w-full lg:w-5/12 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            {/* Speak button */}
            <div className="shrink-0 mt-0.5">
              <SpeakBtn text={verb?.base} />
            </div>

            {/* Word + phonetic + meaning */}
            <div className="flex flex-col gap-0.5">
              <div className="flex items-baseline gap-2">
                <span className="text-base font-semibold text-slate-100">
                  {verb?.base}
                </span>
                <span className="text-xs text-slate-500">
                  /<span className="text-rose-400">{verb?.phonetic}</span>/
                </span>
              </div>
              <span className="text-sm text-slate-400">{verb?.meaning}</span>
            </div>
          </div>

          {/* V2 / V3 forms */}
          {(verb?.v2 || verb?.v3) && (
            <div className="flex flex-wrap gap-2">
              {verb?.v2 && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400">
                  V2 · {verb.v2}
                </span>
              )}
              {verb?.v3 && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                  V3 · {verb.v3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Right: examples ── */}
        <div className="flex-1 flex flex-col gap-2">
          {verb?.examples?.map((ex, i) => (
            <ExampleItem key={i} ex={ex} />
          ))}
        </div>

        {/* ── Action ── */}
        <div className="flex lg:flex-col items-start lg:items-end justify-end lg:justify-start shrink-0">
          <button
            onClick={() => onSelect(verb)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400 hover:bg-amber-500/20 transition-colors cursor-pointer whitespace-nowrap"
          >
            More examples
          </button>
        </div>
      </div>

      {/* Synonyms */}
      {verb?.synonyms && (
        <div className="flex items-center gap-2 flex-wrap pt-2">
          <span className="text-xs font-medium text-slate-500">Synonyms:</span>
          <Synonyms synonyms={verb.synonyms} />
        </div>
      )}
    </div>
  );
};

export default VerbCard;

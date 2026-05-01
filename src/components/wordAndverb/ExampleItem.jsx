import SpeakBtn from "./SpeakBtn";

const ExampleItem = ({ ex }) => {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl px-3 flex flex-col gap-1">
      <div className="flex items-center justify-between gap-2">
        <div className="py-1">
          <p className="text-sm text-slate-200 leading-snug flex-1">{ex?.en}</p>
          <p className="text-xs text-slate-500 leading-snug">{ex?.bn}</p>
        </div>

        <div className="shrink-0">
          <SpeakBtn text={ex?.en} />
        </div>
      </div>
    </div>
  );
};

export default ExampleItem;

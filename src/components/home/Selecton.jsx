const Selecton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="rounded-2xl border border-white/[0.06] bg-[#161b27] p-5 animate-pulse"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-11 w-11 rounded-xl bg-white/[0.06]" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-28 rounded-lg bg-white/[0.06]" />
              <div className="h-3 w-40 rounded-lg bg-white/[0.04]" />
            </div>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/[0.06] mb-4" />
          <div className="space-y-3">
            <div className="h-16 w-full rounded-xl bg-white/[0.04]" />
            <div className="h-16 w-full rounded-xl bg-white/[0.04]" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Selecton;

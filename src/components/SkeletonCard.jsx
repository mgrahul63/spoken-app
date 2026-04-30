// Skeleton card — widths reflect estimated word length
const SkeletonCard = ({ wordLen = 12, defLen = 70 }) => (
  <div className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 flex flex-col gap-2 animate-pulse">
    <div className="flex items-center gap-2.5">
      <div
        className="h-4 bg-white/10 rounded"
        style={{ width: `${wordLen * 8}px` }} // scales with word length
      />
      <div className="h-3.5 w-12 bg-white/[0.06] rounded" /> {/* pos tag */}
    </div>
    <div
      className="h-3 bg-white/[0.06] rounded"
      style={{ width: `${defLen}%` }} // scales with definition length
    />
  </div>
);

export default SkeletonCard;

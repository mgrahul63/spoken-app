import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { fetchWords } from "../api/words";
import SkeletonCard from "../components/SkeletonCard";
import Modal from "../components/wordAndverb/Modal";
import VerbCard from "../components/wordAndverb/VerbCard";
import useDebounce from "../hooks/useDebounce";

const WordPages = () => {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["words"],
    queryFn: fetchWords,
  });

  if (error) return <p>Error...</p>;

  const words = data?.words || [];

  const debouncedSearch = useDebounce(search, 300);

  const query = debouncedSearch.trim().toLowerCase();

  const filtered = words.filter((w) => {
    const base = w.base || "";
    return base.toLowerCase().includes(query);
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col gap-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-100 mb-0.5">
          Vocabulary
        </h1>
        <p className="text-sm text-slate-400">
          <span className="text-emerald-400 font-medium">{words.length}</span>{" "}
          words available
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          type="text"
          placeholder="Search vocabulary..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/10 focus:border-sky-500/40 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 outline-none transition-colors"
        />

        {/* Clear button */}
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {isLoading && <SkeletonCard wordLen={10} defLen={60} />}

      {/* Word cards */}
      <div className="flex flex-col gap-2.5">
        {filtered?.map((v, i) => (
          <VerbCard key={i} verb={v} onSelect={setSelected} />
        ))}
      </div>

      {/* Empty state */}
      {filtered?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-slate-500">
            No words found for{" "}
            <span className="text-slate-300">&quot;{search}&quot;</span>
          </p>
        </div>
      )}

      <Modal data={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default WordPages;

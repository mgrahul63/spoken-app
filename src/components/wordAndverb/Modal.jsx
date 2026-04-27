import { X } from "lucide-react";
import { useEffect, useState } from "react";
import ExampleItem from "./ExampleItem";

const Modal = ({ data, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (data) requestAnimationFrame(() => setShow(true));
  }, [data]);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 250);
  };

  if (!data) return null;

  const title = data?.base
    ? data.base.charAt(0).toUpperCase() + data.base.slice(1)
    : "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-lg max-h-[85vh] bg-[#1a1829] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-250
          ${show ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 shrink-0">
          <div className="flex items-baseline gap-2">
            <h2 className="text-base font-semibold text-emerald-400">
              {title}
            </h2>
            <span className="text-sm text-slate-400">examples</span>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-2 overflow-y-auto flex-1">
          {data?.moreexample?.map((item, i) => (
            <ExampleItem key={i} ex={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;

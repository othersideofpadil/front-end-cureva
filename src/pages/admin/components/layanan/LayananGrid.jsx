import { AnimatePresence } from "framer-motion";
import { ChevronRight, FileText } from "lucide-react";
import LayananCard from "./LayananCard";

const LayananGrid = ({
  items,
  searchQuery,
  onEdit,
  onToggle,
  onDelete,
  onAdd,
}) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
          <FileText className="w-6 h-6 text-slate-300" />
        </div>
        <p className="text-sm font-medium">
          {searchQuery
            ? `Tidak ada hasil untuk "${searchQuery}"`
            : "Belum ada layanan"}
        </p>
        {!searchQuery && (
          <button
            onClick={onAdd}
            className="mt-3 text-xs text-sky-500 hover:underline flex items-center gap-1"
          >
            Tambah layanan pertama <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <AnimatePresence>
        {items.map((item) => (
          <LayananCard
            key={item.id}
            item={item}
            onEdit={onEdit}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default LayananGrid;

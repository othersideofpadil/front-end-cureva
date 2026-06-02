import { Filter, Search, ChevronDown, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const BookingFilters = ({
  search,
  onSearchChange,
  onClearSearch,
  statusFilter,
  statusOptions,
  showFilters,
  onToggleFilters,
  onSelectStatus,
}) => (
  <div className="flex gap-2">
    <div className="relative flex-1">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        placeholder="Cari kode, pasien, atau layanan..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent shadow-sm transition"
      />
      {search && (
        <button
          onClick={onClearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>

    <div className="relative">
      <button
        onClick={onToggleFilters}
        className={`flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium border rounded-xl transition-colors shadow-sm ${
          statusFilter !== "all"
            ? "bg-sky-50 border-sky-200 text-sky-600"
            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
        }`}
      >
        <Filter className="w-4 h-4" />
        <span className="hidden sm:inline">
          {statusFilter === "all"
            ? "Filter"
            : statusOptions.find((opt) => opt.value === statusFilter)?.label}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform ${
            showFilters ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-20"
          >
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onSelectStatus(opt.value)}
                className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                  statusFilter === opt.value
                    ? "text-sky-600 bg-sky-50 font-semibold"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
);

export default BookingFilters;

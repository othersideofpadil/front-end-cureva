import { AnimatePresence, motion } from "framer-motion";
import { Filter, Search, X } from "lucide-react";

const UsersFilters = ({
  search,
  roleFilter,
  filteredCount,
  totalCount,
  onSearchChange,
  onClearSearch,
  onRoleChange,
}) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Cari nama, email, atau telepon..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400 transition-all placeholder:text-slate-400"
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

      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-400 shrink-0" />
        {"all pasien admin".split(" ").map((role) => (
          <button
            key={role}
            onClick={() => onRoleChange(role)}
            className={`px-3 py-2 text-xs font-semibold rounded-xl capitalize transition-all whitespace-nowrap ${
              roleFilter === role
                ? "bg-sky-500 text-white shadow-sm shadow-sky-200"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {role === "all" ? "Semua" : role}
          </button>
        ))}
      </div>
    </div>

    <AnimatePresence>
      {(search || roleFilter !== "all") && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500"
        >
          <span>Menampilkan</span>
          <span className="font-semibold text-slate-700">{filteredCount}</span>
          <span>dari {totalCount} pengguna</span>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default UsersFilters;

import { Plus } from "lucide-react";

const LayananHeader = ({ onAdd }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
        Kelola Layanan
      </h1>
      <p className="text-sm text-slate-500 mt-0.5">
        Atur layanan fisioterapi yang tersedia
      </p>
    </div>
    <button
      onClick={onAdd}
      className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-xl shadow-sm shadow-sky-200 transition-colors"
    >
      <Plus className="w-4 h-4" />
      Tambah Layanan
    </button>
  </div>
);

export default LayananHeader;

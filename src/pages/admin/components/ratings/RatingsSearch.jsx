import { Search } from "lucide-react";

const RatingsSearch = ({ value, onChange }) => (
  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        placeholder="Cari nama pasien, email, layanan, atau review..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white placeholder-slate-400 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition"
      />
    </div>
  </div>
);

export default RatingsSearch;

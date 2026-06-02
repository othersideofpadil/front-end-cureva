import { Filter, Search } from "lucide-react";
import { Card } from "../../../../components/common";

const PaymentsFilters = ({
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusChange,
}) => (
  <Card>
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Cari kode booking atau nama..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-slate-400" />
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="all">Semua Status</option>
          <option value="menunggu">Menunggu</option>
          <option value="dibayar">Dibayar</option>
          <option value="gagal">Gagal</option>
        </select>
      </div>
    </div>
  </Card>
);

export default PaymentsFilters;

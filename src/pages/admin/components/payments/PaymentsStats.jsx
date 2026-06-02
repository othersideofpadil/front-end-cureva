import { CreditCard, Check, Clock, DollarSign } from "lucide-react";
import { Card } from "../../../../components/common";

const PaymentsStats = ({ stats, formatPrice }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <Card className="bg-slate-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 shrink-0 bg-slate-200 rounded-lg flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-slate-600" />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
          <p className="text-sm text-slate-500">Total Transaksi</p>
        </div>
      </div>
    </Card>
    <Card className="bg-amber-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 shrink-0 bg-amber-200 rounded-lg flex items-center justify-center">
          <Clock className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
          <p className="text-sm text-amber-600">Menunggu Verifikasi</p>
        </div>
      </div>
    </Card>
    <Card className="bg-emerald-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 shrink-0 bg-emerald-200 rounded-lg flex items-center justify-center">
          <Check className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <p className="text-2xl font-bold text-emerald-600">
            {stats.confirmed}
          </p>
          <p className="text-sm text-emerald-600">Dikonfirmasi</p>
        </div>
      </div>
    </Card>
    <Card className="bg-sky-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 shrink-0 bg-sky-200 rounded-lg flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-sky-600" />
        </div>
        <div className="overflow-hidden">
          <p className="text-xl font-bold text-sky-600 truncate">
            {formatPrice(stats.totalAmount)}
          </p>
          <p className="text-sm text-sky-600">Total Pendapatan</p>
        </div>
      </div>
    </Card>
  </div>
);

export default PaymentsStats;

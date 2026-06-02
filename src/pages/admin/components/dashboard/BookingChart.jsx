import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BookingChart = ({
  chartPeriod,
  onPeriodChange,
  chartData,
  windowWidth,
}) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
      <h3 className="text-base font-semibold text-slate-800">Tren Booking</h3>
      <select
        value={chartPeriod}
        onChange={(e) => onPeriodChange(e.target.value)}
        className="px-3 py-1.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
      >
        <option value="daily">Harian (7 Hari)</option>
        <option value="weekly">Mingguan (4 Minggu)</option>
        <option value="monthly">Bulanan (6 Bulan)</option>
      </select>
    </div>
    {chartData.length === 0 ? (
      <div className="flex items-center justify-center py-12 text-slate-400 text-sm">
        Tidak ada data untuk periode ini
      </div>
    ) : (
      <ResponsiveContainer width="100%" height={windowWidth < 640 ? 250 : 300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
          />
          <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "0.75rem",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="bookings"
            stroke="#0ea5e9"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorBookings)"
          />
        </AreaChart>
      </ResponsiveContainer>
    )}
  </div>
);

export default BookingChart;

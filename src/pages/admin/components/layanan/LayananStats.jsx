const LayananStats = ({ total, active }) => (
  <div className="grid grid-cols-3 gap-3">
    {[
      { label: "Total Layanan", value: total },
      { label: "Aktif", value: active },
      { label: "Nonaktif", value: total - active },
    ].map((stat) => (
      <div
        key={stat.label}
        className="bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm text-center"
      >
        <p className="text-xl sm:text-2xl font-bold text-slate-800">
          {stat.value}
        </p>
        <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 font-medium">
          {stat.label}
        </p>
      </div>
    ))}
  </div>
);

export default LayananStats;

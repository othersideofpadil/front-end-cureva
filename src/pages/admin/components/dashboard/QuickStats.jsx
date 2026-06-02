const QuickStats = ({ items, href = "/admin/bookings" }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
    {items.map((item) => (
      <div
        key={item.label}
        className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 sm:p-3 ${item.bg} rounded-xl shrink-0`}>
            <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.iconColor}`} />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-slate-800">
              {item.value}
            </p>
            <p className="text-xs sm:text-sm text-slate-500">{item.label}</p>
          </div>
        </div>
        <a
          href={href}
          className="text-xs font-medium text-sky-600 hover:text-sky-700"
        >
          Lihat
        </a>
      </div>
    ))}
  </div>
);

export default QuickStats;

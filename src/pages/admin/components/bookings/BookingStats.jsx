const BookingStats = ({ stats }) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
    {stats.map((item) => (
      <div
        key={item.label}
        className="bg-white border border-slate-100 rounded-2xl px-3 py-3 sm:px-4 shadow-sm text-center"
      >
        <p className="text-lg sm:text-2xl font-bold text-slate-800">
          {item.value}
        </p>
        <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 font-medium leading-tight">
          {item.label}
        </p>
      </div>
    ))}
  </div>
);

export default BookingStats;

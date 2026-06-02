const SlotSummary = ({ slots }) => {
  const counts = slots.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] ?? 0) + 1;
    return acc;
  }, {});

  const items = [
    {
      key: "tersedia",
      label: "Tersedia",
      color: "text-emerald-600 bg-emerald-50",
    },
    { key: "dipesan", label: "Terpesan", color: "text-sky-600 bg-sky-50" },
    {
      key: "diblock_admin",
      label: "Diblokir",
      color: "text-red-500 bg-red-50",
    },
    { key: "libur", label: "Libur", color: "text-slate-500 bg-slate-100" },
  ].filter((item) => counts[item.key]);

  if (!items.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {items.map((item) => (
        <span
          key={item.key}
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${item.color}`}
        >
          <span className="font-bold">{counts[item.key]}</span>
          {item.label}
        </span>
      ))}
    </div>
  );
};

export default SlotSummary;

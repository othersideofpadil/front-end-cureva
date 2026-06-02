const InfoBlock = ({ icon: Icon, label, children }) => (
  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-4 h-4 text-slate-400" />
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
        {label}
      </span>
    </div>
    {children}
  </div>
);

export default InfoBlock;

import { ShieldCheck, UserCheck, Users } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className={`rounded-2xl p-4 ${color} flex items-center gap-4`}>
    <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-xs font-medium text-white/70 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-2xl font-bold text-white leading-none mt-0.5">
        {value}
      </p>
    </div>
  </div>
);

const UsersStats = ({ total, totalAdmin, totalVerified }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
    <StatCard
      icon={Users}
      label="Total Pengguna"
      value={total}
      color="bg-gradient-to-br from-sky-500 to-indigo-600"
    />
    <StatCard
      icon={ShieldCheck}
      label="Admin"
      value={totalAdmin}
      color="bg-gradient-to-br from-violet-500 to-purple-700"
    />
    <div className="col-span-2 sm:col-span-1">
      <StatCard
        icon={UserCheck}
        label="Terverifikasi"
        value={totalVerified}
        color="bg-gradient-to-br from-emerald-500 to-teal-600"
      />
    </div>
  </div>
);

export default UsersStats;

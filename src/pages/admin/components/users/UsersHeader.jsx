const UsersHeader = ({ usersCount }) => (
  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-sky-500 mb-1">
        Administrasi
      </p>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight">
        Kelola Pengguna
      </h1>
      <p className="text-sm text-slate-500 mt-1">
        {usersCount} pengguna terdaftar
      </p>
    </div>
  </div>
);

export default UsersHeader;

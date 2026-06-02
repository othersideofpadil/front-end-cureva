import { AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";
import UserCard from "./UserCard";

const UsersGrid = ({ users, onEdit, onDelete }) => {
  if (users.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="font-semibold text-slate-700 mb-1">
          Tidak ada pengguna ditemukan
        </h3>
        <p className="text-sm text-slate-400">
          Coba ubah kata kunci atau filter pencarian
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <AnimatePresence mode="popLayout">
        {users.map((user, index) => (
          <UserCard
            key={user.id}
            user={user}
            index={index}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default UsersGrid;

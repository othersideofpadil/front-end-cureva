import { Phone, ShieldCheck, User } from "lucide-react";
import { Button, Input, Modal } from "../../../../components/common";

const EditUserModal = ({
  isOpen,
  selectedUser,
  editData,
  onChange,
  onRoleChange,
  onClose,
  onSave,
  actionLoading,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Edit Pengguna"
    responsive
    footerClassName="flex-col sm:flex-row"
    footer={
      <>
        <Button variant="secondary" onClick={onClose}>
          Batal
        </Button>
        <Button onClick={onSave} loading={actionLoading}>
          Simpan Perubahan
        </Button>
      </>
    }
  >
    {selectedUser && (
      <div className="space-y-5">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-white text-lg font-bold">
            {selectedUser.nama?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-800">{selectedUser.nama}</p>
            <p className="text-xs text-slate-500">{selectedUser.email}</p>
          </div>
        </div>

        <Input
          label="Nama Lengkap"
          value={editData.nama}
          onChange={(e) => onChange("nama", e.target.value)}
          leftIcon={User}
        />
        <Input
          label="Nomor Telepon"
          value={editData.telepon}
          onChange={(e) => onChange("telepon", e.target.value)}
          leftIcon={Phone}
        />
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Role Pengguna
          </label>
          <div className="grid grid-cols-2 gap-3">
            {["pasien", "admin"].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => onRoleChange(role)}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium capitalize transition-all ${
                  editData.role === role
                    ? role === "admin"
                      ? "border-violet-500 bg-violet-50 text-violet-700"
                      : "border-sky-500 bg-sky-50 text-sky-700"
                    : "border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                {role === "admin" ? (
                  <ShieldCheck className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>
    )}
  </Modal>
);

export default EditUserModal;

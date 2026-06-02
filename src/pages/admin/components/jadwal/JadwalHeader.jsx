import { Plus } from "lucide-react";
import { Button } from "../../../../components/common";

const JadwalHeader = ({ canManageDate, onCreate }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
        Kelola Jadwal
      </h1>
      <p className="text-sm text-slate-500 mt-0.5">
        Atur jadwal slot praktik fisioterapis
      </p>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="secondary"
        onClick={onCreate}
        leftIcon={Plus}
        disabled={!canManageDate}
        size="sm"
      >
        Tambah Slot
      </Button>
    </div>
  </div>
);

export default JadwalHeader;

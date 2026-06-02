import {
  AlertCircle,
  Calendar,
  ExternalLink,
  FileText,
  MapPin,
  User,
} from "lucide-react";
import {
  STATUS_META,
  formatCurrency,
  formatDate,
  formatTime,
  statusBadgeClass,
} from "../../../../utils/constants";
import { Modal } from "../../../../components/common";
import InfoBlock from "./InfoBlock";

const BookingDetailModal = ({ isOpen, selectedBooking, onClose }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={
      <div>
        <h2 className="text-base font-bold text-slate-800">Detail Booking</h2>
        {selectedBooking?.kode_booking && (
          <p className="text-xs text-slate-400 mt-0.5">
            {selectedBooking.kode_booking}
          </p>
        )}
      </div>
    }
    size="lg"
    responsive
  >
    {selectedBooking && (
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2">
          <span className="text-xs text-slate-400 font-medium">
            Status saat ini
          </span>
          <span className={statusBadgeClass(selectedBooking.status)}>
            {STATUS_META[selectedBooking.status]?.label ||
              selectedBooking.status}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <InfoBlock icon={User} label="Pasien">
            <p className="font-semibold text-slate-800 text-sm">
              {selectedBooking.nama_pasien}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedBooking.email_pasien}
            </p>
            {selectedBooking.telepon_pasien && (
              <p className="text-xs text-slate-500">
                {selectedBooking.telepon_pasien}
              </p>
            )}
          </InfoBlock>

          <InfoBlock icon={Calendar} label="Jadwal">
            <p className="font-semibold text-slate-800 text-sm">
              {formatDate(selectedBooking.tanggal)}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {formatTime(selectedBooking.waktu)} WIB
            </p>
          </InfoBlock>
        </div>

        <InfoBlock icon={FileText} label="Layanan">
          <p className="font-semibold text-slate-800 text-sm">
            {selectedBooking.nama_layanan}
          </p>
          {selectedBooking.harga_layanan && (
            <p className="text-xs text-slate-500 mt-0.5">
              {formatCurrency(selectedBooking.harga_layanan)}
            </p>
          )}
        </InfoBlock>

        <InfoBlock icon={MapPin} label="Alamat">
          <p className="text-sm text-slate-700 leading-relaxed">
            {selectedBooking.alamat}
          </p>
          {selectedBooking.koordinat && (
            <a
              href={selectedBooking.koordinat}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-xs text-sky-600 hover:text-sky-700 font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Buka di Google Maps
            </a>
          )}
        </InfoBlock>

        <InfoBlock icon={AlertCircle} label="Keluhan">
          <p className="text-sm text-slate-700 leading-relaxed">
            {selectedBooking.keluhan || "-"}
          </p>
        </InfoBlock>

        {selectedBooking.catatan_tambahan && (
          <InfoBlock icon={FileText} label="Catatan Tambahan">
            <p className="text-sm text-slate-700 leading-relaxed">
              {selectedBooking.catatan_tambahan}
            </p>
          </InfoBlock>
        )}

        {selectedBooking.catatan_admin && (
          <InfoBlock icon={FileText} label="Catatan Progres">
            <p className="text-sm text-slate-700 leading-relaxed">
              {selectedBooking.catatan_admin}
            </p>
          </InfoBlock>
        )}

        <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-100">
          <span className="text-sm text-slate-500 font-medium">
            Total Biaya
          </span>
          <span className="text-xl font-bold text-sky-600">
            {formatCurrency(selectedBooking.harga_layanan)}
          </span>
        </div>
      </div>
    )}
  </Modal>
);

export default BookingDetailModal;

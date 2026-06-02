import { motion } from "framer-motion";
import {
  Star,
  User,
  ClipboardList,
  Edit,
  Trash2,
  Calendar,
} from "lucide-react";
import { Button } from "../../../../components/common";

const RatingCard = ({ item, onEdit, onDelete, formatDate }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.98 }}
    className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-5"
  >
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <ClipboardList className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-700">
            {item.nama_layanan || "Layanan"}
          </span>
          {item.tanggal_review && (
            <span className="inline-flex items-center gap-1 text-slate-400">
              <Calendar className="w-3 h-3" />
              {formatDate(item.tanggal_review)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= item.rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500">{item.rating}/5</span>
        </div>
        {item.review && (
          <p className="text-sm text-slate-600 bg-slate-50 rounded-xl px-3 py-2.5 leading-relaxed">
            "{item.review}"
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:items-end">
        <div className="text-xs text-slate-500 flex items-center gap-2">
          <User className="w-4 h-4 text-slate-300" />
          <div>
            <p className="font-semibold text-slate-700">{item.nama_pasien}</p>
            <p className="text-slate-400">{item.email_pasien}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={Edit}
            onClick={() => onEdit(item)}
          >
            Update
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={Trash2}
            onClick={() => onDelete(item)}
          >
            Hapus
          </Button>
        </div>
      </div>
    </div>
  </motion.div>
);

export default RatingCard;

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const RatingCard = ({ rating, name, role, content, therapistName }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
    >
      {/* Star Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
        ))}
        {[...Array(5 - rating)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-slate-200" />
        ))}
      </div>

      {/* Review Text */}
      <p className="text-slate-600 mb-4 text-sm leading-relaxed">"{content}"</p>

      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-linear-to-br from-sky-400 to-indigo-400 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
          {name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900 text-sm truncate">
            {name}
          </p>
          <p className="text-xs text-slate-500 truncate">{role}</p>
          {therapistName && (
            <p className="text-xs text-sky-600 font-medium">
              untuk {therapistName}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export { RatingCard };
export default RatingCard;

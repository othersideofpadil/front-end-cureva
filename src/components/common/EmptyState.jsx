import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import Button from "./Button";

const EmptyState = ({
  icon: Icon = AlertTriangle,
  title = "Tidak ada data",
  description = "Data yang Anda cari tidak ditemukan.",
  action,
  actionLabel = "Coba Lagi",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6"
      >
        <Icon className="w-10 h-10 text-slate-400" />
      </motion.div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 mb-6 max-w-sm">{description}</p>
      {action && (
        <Button onClick={action} variant="secondary">
          <RefreshCcw className="w-4 h-4" />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;

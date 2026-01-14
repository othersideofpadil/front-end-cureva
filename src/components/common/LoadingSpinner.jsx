import { motion } from "framer-motion";

const LoadingSpinner = ({ size = "md", fullScreen = false }) => {
  const sizes = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const spinner = (
    <motion.div
      className={`${sizes[size]} border-4 border-sky-200 border-t-sky-500 rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="w-16 h-16 border-4 border-sky-200 border-t-sky-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-slate-600 font-medium"
          >
            Memuat...
          </motion.p>
        </div>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;

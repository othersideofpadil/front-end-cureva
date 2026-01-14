import { motion } from "framer-motion";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  type = "button",
  onClick,
  className = "",
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-sky-500 hover:bg-sky-600 text-white focus:ring-sky-500 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40",
    secondary:
      "bg-slate-100 hover:bg-slate-200 text-slate-700 focus:ring-slate-500",
    success:
      "bg-emerald-500 hover:bg-emerald-600 text-white focus:ring-emerald-500 shadow-lg shadow-emerald-500/25",
    danger:
      "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 shadow-lg shadow-red-500/25",
    warning:
      "bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-500 shadow-lg shadow-amber-500/25",
    outline:
      "border-2 border-sky-500 text-sky-500 hover:bg-sky-50 focus:ring-sky-500",
    ghost: "text-slate-600 hover:bg-slate-100 focus:ring-slate-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2",
    xl: "px-8 py-4 text-lg gap-3",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <motion.div
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      ) : (
        LeftIcon && <LeftIcon className="w-4 h-4" />
      )}
      {children}
      {RightIcon && !loading && <RightIcon className="w-4 h-4" />}
    </motion.button>
  );
};

export default Button;

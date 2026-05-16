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
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variants = {
    primary:
      "bg-linear-to-r from-[#003C82] to-[#7B68EE] text-white focus:ring-[#7B68EE] shadow-lg shadow-[#003C82]/25 hover:shadow-[#7B68EE]/30",
    secondary:
      "bg-[#003C82] hover:bg-[#002F66] text-white focus:ring-[#003C82] shadow-lg shadow-[#003C82]/20",
    success:
      "bg-[#7B68EE] hover:bg-[#6A57DF] text-white focus:ring-[#7B68EE] shadow-lg shadow-[#7B68EE]/25",
    danger:
      "bg-[#003C82] hover:bg-[#002F66] text-white focus:ring-[#003C82] shadow-lg shadow-[#003C82]/25",
    warning:
      "bg-[#7B68EE] hover:bg-[#6A57DF] text-white focus:ring-[#7B68EE] shadow-lg shadow-[#7B68EE]/25",
    outline:
      "border-2 border-[#003C82] text-[#003C82] hover:bg-[#003C82]/10 focus:ring-[#003C82]",
    ghost: "text-[#003C82] hover:bg-[#003C82]/10 focus:ring-[#003C82]",
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

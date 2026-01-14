import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      error,
      helperText,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      className = "",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <div className="relative">
          {LeftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <LeftIcon className="w-5 h-5" />
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={`
            w-full px-4 py-3 rounded-xl border bg-white
            transition-all duration-200
            placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent
            ${LeftIcon ? "pl-11" : ""}
            ${RightIcon || isPassword ? "pr-11" : ""}
            ${
              error
                ? "border-red-300 focus:ring-red-500"
                : "border-slate-200 hover:border-slate-300"
            }
            ${className}
          `}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
          {RightIcon && !isPassword && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <RightIcon className="w-5 h-5" />
            </div>
          )}
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-red-500"
            >
              {error}
            </motion.p>
          )}
          {helperText && !error && (
            <p className="text-sm text-slate-500">{helperText}</p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

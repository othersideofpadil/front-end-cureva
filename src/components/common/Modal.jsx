import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Button from "./Button";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showClose = true,
  footer,
  responsive = false,
  contentClassName = "",
  bodyClassName = "",
  headerClassName = "",
  footerClassName = "",
}) => {
  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <div
            className={`flex min-h-full justify-center p-4 ${
              responsive ? "items-end md:items-center" : "items-center"
            }`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className={`
                relative w-full ${sizes[size]}
                bg-white shadow-2xl overflow-hidden
                ${responsive ? "rounded-t-3xl md:rounded-2xl" : "rounded-2xl"}
                ${responsive ? "flex flex-col max-h-[92dvh] md:max-h-[88vh]" : ""}
                ${contentClassName}
              `}
            >
              {/* Header */}
              {(title || showClose) && (
                <div
                  className={`flex items-center justify-between p-6 border-b border-slate-100 ${headerClassName}`}
                >
                  {title &&
                    (typeof title === "string" ? (
                      <h3 className="text-xl font-bold text-slate-800">
                        {title}
                      </h3>
                    ) : (
                      title
                    ))}
                  {showClose && (
                    <button
                      onClick={onClose}
                      className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}

              {/* Body */}
              <div
                className={`p-6 ${responsive ? "flex-1 overflow-y-auto" : ""} ${bodyClassName}`}
              >
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div
                  className={`flex items-center justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50 ${footerClassName}`}
                >
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;

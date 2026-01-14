import { motion } from "framer-motion";

const Card = ({
  children,
  className = "",
  hover = false,
  padding = "md",
  ...props
}) => {
  const paddings = {
    none: "",
    sm: "p-3 sm:p-4",
    md: "p-4 sm:p-6",
    lg: "p-6 sm:p-8",
  };

  const Component = hover ? motion.div : "div";
  const hoverProps = hover
    ? {
        whileHover: { y: -4, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)" },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <Component
      className={`
        bg-white rounded-2xl shadow-sm border border-slate-100
        ${paddings[padding]}
        ${className}
      `}
      {...hoverProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;

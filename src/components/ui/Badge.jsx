import { classNames } from "@/utils/helpers";

/**
 * Composant Badge pour afficher des statuts
 */
const Badge = ({ children, variant = "info", size = "md", className = "" }) => {
  const variants = {
    success: "badge-success",
    warning: "badge-warning",
    danger: "badge-danger",
    info: "badge-info",
    purple: "badge-purple",
  };

  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "text-base px-3 py-1",
  };

  return (
    <span
      className={classNames("badge", variants[variant], sizes[size], className)}
    >
      {children}
    </span>
  );
};

export default Badge;

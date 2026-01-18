import { classNames } from "@/utils/helpers";

/**
 * Composant Card pour encadrer du contenu
 */
const Card = ({
  children,
  title,
  subtitle,
  actions,
  className = "",
  hover = false,
}) => {
  return (
    <div
      className={classNames(
        "bg-white rounded-xl shadow-sm p-6 animate-slide-up",
        hover && "card-hover",
        className
      )}
    >
      {(title || subtitle || actions) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}

      {children}
    </div>
  );
};

export default Card;

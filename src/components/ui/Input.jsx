import { classNames } from "@/utils/helpers";

/**
 * Composant Input réutilisable
 */
const Input = ({ label, error, icon: Icon, className = "", ...props }) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}

        <input
          className={classNames(
            "w-full px-4 py-2 border rounded-lg transition-smooth",
            "focus:ring-2 focus:ring-purple-500 focus:border-transparent",
            Icon && "pl-10",
            error ? "border-red-500" : "border-gray-300",
            className
          )}
          {...props}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;

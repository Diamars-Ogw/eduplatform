import { classNames } from "@/utils/helpers";

/**
 * Composant Select réutilisable
 */
const Select = ({
  label,
  error,
  options = [],
  placeholder = "Sélectionner...",
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <select
        className={classNames(
          "w-full px-4 py-2 border rounded-lg transition-smooth",
          "focus:ring-2 focus:ring-purple-500 focus:border-transparent",
          error ? "border-red-500" : "border-gray-300",
          className
        )}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Select;

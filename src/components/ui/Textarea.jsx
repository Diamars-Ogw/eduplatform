import { classNames } from "@/utils/helpers";

/**
 * Composant Textarea réutilisable
 */
const Textarea = ({ label, error, rows = 4, className = "", ...props }) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        rows={rows}
        className={classNames(
          "w-full px-4 py-2 border rounded-lg transition-smooth resize-none",
          "focus:ring-2 focus:ring-purple-500 focus:border-transparent",
          error ? "border-red-500" : "border-gray-300",
          className
        )}
        {...props}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Textarea;

import { classNames } from "@/utils/helpers";

/**
 * Composant Loader pour les chargements
 */
const Loader = ({
  size = "md",
  text = "Chargement...",
  fullScreen = false,
}) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  const content = (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={classNames("spinner", sizes[size])} />
      {text && <p className="mt-4 text-gray-600 animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;

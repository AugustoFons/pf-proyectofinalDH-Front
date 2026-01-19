import { HiX, HiExclamationCircle } from "react-icons/hi";

type PopUpProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
};

export function PopUp({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger"
}: PopUpProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: "text-red-600",
      iconBg: "bg-red-100",
      button: "bg-red-600 hover:bg-red-700 focus:ring-red-500 cursor-pointer"
    },
    warning: {
      icon: "text-yellow-600",
      iconBg: "bg-yellow-100",
      button: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 cursor-pointer"
    },
    info: {
      icon: "text-blue-600",
      iconBg: "bg-blue-100",
      button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 cursor-pointer"
    }
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition cursor-pointer"
          >
            <HiX className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="p-6">
            {/* Icon */}
            <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${styles.iconBg}`}>
              <HiExclamationCircle className={`h-6 w-6 ${styles.icon}`} />
            </div>

            {/* Title */}
            <h3 className="mt-4 text-center text-lg font-semibold text-gray-900">
              {title}
            </h3>

            {/* Message */}
            <p className="mt-2 text-center text-sm text-gray-600">
              {message}
            </p>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition focus:outline-none focus:ring-2 ${styles.button}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import type { ReactNode } from 'react';

type ModalProps = {
  isOpen: boolean;
  title: string;
  message?: string;
  subTitle?: string;
  icon?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmClassName?: string;
  cancelClassName?: string;
};

export function Modal({
  isOpen,
  title,
  message,
  subTitle,
  icon,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  confirmClassName,
  cancelClassName,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-red-100">
        {icon && <div className="mb-4">{icon}</div>}
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {subTitle && <p className="mt-2 text-red-600 font-medium">{subTitle}</p>}
        {message && <p className="mt-3 text-gray-800">{message}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className={cancelClassName ?? 'px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200'}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={confirmClassName ?? 'px-4 py-2 rounded-lg primary-bg text-white primary-bg-hover'}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

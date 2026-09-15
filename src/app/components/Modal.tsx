import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCallback, useEffect, type ReactNode } from 'react';

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

type ListModalItem = {
  id: string | number;
};

type ListModalProps<T extends ListModalItem> = {
  isOpen: boolean;
  selectedItem: T | null;
  contentArray?: T[];
  onClose: () => void;
  onSelect?: (selectedItem: T) => void;
  children: ReactNode;
  ariaLabelledBy?: string;
  itemLabel?: string;
  className?: string;
};

export function ListModal<T extends ListModalItem>({
  isOpen,
  selectedItem,
  contentArray = [],
  onClose,
  onSelect,
  children,
  ariaLabelledBy,
  itemLabel = 'item',
  className = 'max-w-lg',
}: ListModalProps<T>) {
  const selectedIndex = selectedItem
    ? Math.max(contentArray.findIndex((item) => item.id === selectedItem.id), 0)
    : 0;

  const moveTo = useCallback((index: number) => {
    if (contentArray.length === 0) return;

    const nextIndex = (index + contentArray.length) % contentArray.length;
    onSelect?.(contentArray[nextIndex]);
  }, [contentArray, onSelect]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') moveTo(selectedIndex - 1);
      if (event.key === 'ArrowRight') moveTo(selectedIndex + 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, moveTo, onClose, selectedIndex]);

  if (!isOpen || !selectedItem) return null;

  return (
    <div
      className="fixed inset-0 z-70 flex items-center justify-center bg-slate-950/60 px-2 py-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <article
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        className={`relative w-full overflow-hidden rounded-2xl bg-white shadow-2xl ${className}`}
      >
        <div className="p-4 sm:p-6">
          {children}

          {contentArray.length > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => moveTo(selectedIndex - 1)}
                aria-label={`Previous ${itemLabel}`}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex gap-1.5" aria-label={`${selectedIndex + 1} of ${contentArray.length} ${itemLabel}s`}>
                {contentArray.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`Show ${itemLabel} ${index + 1}`}
                    onClick={() => moveTo(index)}
                    className={`h-2 rounded-full transition-all ${index === selectedIndex ? 'w-6 bg-slate-900' : 'w-2 bg-slate-200 hover:bg-slate-300'}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => moveTo(selectedIndex + 1)}
                aria-label={`Next ${itemLabel}`}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
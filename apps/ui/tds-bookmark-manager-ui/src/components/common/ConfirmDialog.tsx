/**
 * ConfirmDialog.tsx
 *
 * Purpose:
 * - Renders a customizable confirmation dialog using `@headlessui/react`.
 * - Supports destructive (e.g., delete) and non-destructive (e.g., confirm action) styling.
 *
 * Logic Overview:
 * 1. Uses `Dialog` component from `@headlessui/react` for accessibility and modal behavior.
 * 2. Accepts props for `isOpen`, `onClose`, `onConfirm`, `title`, `message`, `confirmText`, `cancelText`, and `isDestructive`.
 * 3. `handleConfirm`: Calls both `onConfirm` and `onClose` when the confirm button is clicked.
 * 4. Conditionally renders an `AlertTriangle` icon and applies red styling for destructive actions.
 * 5. Applies blue styling for non-destructive actions.
 * 6. Renders two buttons: one for canceling (closes the dialog) and one for confirming (triggers `onConfirm` and closes).
 *
 * Last Updated:
 * 2025-07-16 by Cline (Added file header documentation)
 */
import { Dialog } from '@headlessui/react';
import { AlertTriangle } from 'lucide-react';


interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  isDestructive?: boolean;
}

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  isDestructive = true
}: ConfirmDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-sm rounded-lg bg-white shadow-xl">
          <div className="p-6">
            <div className="flex items-center mb-4">
              {isDestructive && (
                <div className="mr-3 flex-shrink-0 bg-red-100 rounded-full p-1">
                  <AlertTriangle className="h-5 w-5 text-red-600" data-testid="alert-triangle-icon" />
                </div>
              )}
              <Dialog.Title className="text-lg font-medium text-gray-900">
                {title}
              </Dialog.Title>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">{message}</p>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isDestructive
                    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ConfirmDialog;

import React from "react";

interface EnrollDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const EnrollDialog: React.FC<EnrollDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full animate-fade-in">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Xác nhận tham gia khóa học
        </h2>
        <p className="text-gray-600 mb-6">
          Bạn có chắc chắn muốn đăng ký tham gia khóa học này không?
        </p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

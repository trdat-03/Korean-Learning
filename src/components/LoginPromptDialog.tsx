import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constant/route";

interface LoginPromptDialogProps {
  open: boolean;
  onClose: () => void;
}

export const LoginPromptDialog: React.FC<LoginPromptDialogProps> = ({
  open,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose(); // Đóng dialog trước
    navigate(ROUTES.LOGIN); // Navigate tới trang login
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full animate-fade-in">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Bạn chưa đăng nhập
        </h2>
        <p className="text-gray-600 mb-6">
          Bạn cần đăng nhập để tiếp tục. Bạn có muốn đăng nhập ngay bây giờ không?
        </p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            onClick={handleLogin}
          >
            Đăng nhập nha
          </button>
        </div>
      </div>
    </div>
  );
};
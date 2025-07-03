import { ROUTES } from "@/constant/route";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/utils/AuthService";

export const useLogout = () => {
  const nav = useNavigate();

  const handleLogout = () => {
    try {

      AuthService.logout();
      toast.success("Đăng xuất thành công!");
      nav(ROUTES.LOGIN);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return handleLogout;
};

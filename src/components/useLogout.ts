import { ROUTES } from "@/constant/route";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/utils/AuthService";

export const useLogout = () => {
  const nav = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    
    // Trigger storage event for other components to react
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'user',
      newValue: null,
      oldValue: localStorage.getItem('user')
    }));
    
    toast.success("Đăng xuất thành công!");
    nav(ROUTES.LOGIN);
  };

  return handleLogout;
};

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginService, type LoginRequest } from "@/services/auth/loginService";
import { AuthService } from "@/utils/AuthService";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user } = await loginService.login(credentials);

      // Lưu thông tin user vào localStorage
      AuthService.login(user);

      // Redirect theo role
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else if (user.role === "TEACHER") {
        navigate("/teacher"); 
      }
      else {
        navigate("/");
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Có lỗi xảy ra");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    login,
    isLoading,
    error,
    clearError,
  };
};

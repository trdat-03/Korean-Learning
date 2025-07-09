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
      const { token, user } = await loginService.login(credentials);
      
      // Save auth data
      AuthService.login(token, user);

      // Redirect based on user role
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Có lỗi xảy ra");
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

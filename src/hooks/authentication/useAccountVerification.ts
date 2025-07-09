import { useState } from "react";
import { authVerificationService, type RegisterRequest } from "@/services/auth/authVerificationService";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await authVerificationService.register(data);
      setSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
    setIsLoading(false);
  };

  return {
    register,
    isLoading,
    error,
    success,
    reset,
  };
};

export const useVerifyAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const verifyAccount = async (code: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await authVerificationService.verifyAccount(code);
      setSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Xác thực thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
    setIsLoading(false);
  };

  return {
    verifyAccount,
    isLoading,
    error,
    success,
    reset,
  };
};

export const useResendVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resendVerification = async (email: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await authVerificationService.resendVerification(email);
      setSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Gửi lại mã thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
    setIsLoading(false);
  };

  return {
    resendVerification,
    isLoading,
    error,
    success,
    reset,
  };
};

export const useCheckVerificationCode = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  const checkCode = async (code: string) => {
    setIsLoading(true);
    setError(null);
    setIsValid(false);

    try {
      await authVerificationService.checkVerificationCode(code);
      setIsValid(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Mã không hợp lệ");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setIsValid(false);
    setIsLoading(false);
  };

  return {
    checkCode,
    isLoading,
    error,
    isValid,
    reset,
  };
};

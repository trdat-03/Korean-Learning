import { useState } from "react";
import { passwordResetService } from "@/services/passwordResetService";

export const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sendResetCode = async (email: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await passwordResetService.sendResetCode(email);
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
    sendResetCode,
    isLoading,
    error,
    success,
    reset,
  };
};

export const useVerifyResetCode = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  const verifyCode = async (code: string) => {
    setIsLoading(true);
    setError(null);
    setIsValid(false);

    try {
      await passwordResetService.verifyResetCode(code);
      setIsValid(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Mã xác nhận không hợp lệ");
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
    verifyCode,
    isLoading,
    error,
    isValid,
    reset,
  };
};

export const useResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetPassword = async (code: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await passwordResetService.resetPassword(code, newPassword);
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
    resetPassword,
    isLoading,
    error,
    success,
    reset,
  };
};

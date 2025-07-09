interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

interface VerifyAccountRequest {
  code: string;
}

interface ResendVerificationRequest {
  email: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

class AuthVerificationService {
  private baseUrl = "http://localhost:8080/api/auth";

  async register(data: RegisterRequest): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Đăng ký thất bại");
      }

      return result;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Lỗi kết nối server");
    }
  }

  async verifyAccount(code: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/verify-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Xác thực thất bại");
      }

      return result;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Lỗi kết nối server");
    }
  }

  async resendVerification(email: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Gửi lại mã thất bại");
      }

      return result;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Lỗi kết nối server");
    }
  }

  async checkVerificationCode(code: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/check-verification-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Kiểm tra mã thất bại");
      }

      return result;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Lỗi kết nối server");
    }
  }
}

export const authVerificationService = new AuthVerificationService();
export type { RegisterRequest, VerifyAccountRequest, ResendVerificationRequest, ApiResponse };

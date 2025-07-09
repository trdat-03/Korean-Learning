interface ApiResponse {
  success: boolean;
  message: string;
}

class PasswordResetService {
  private baseUrl = "http://localhost:8080/api/auth";

  async sendResetCode(email: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Gửi mã xác nhận thất bại");
      }

      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Lỗi kết nối server");
    }
  }

  async verifyResetCode(code: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/verify-reset-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Mã xác nhận không hợp lệ");
      }

      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Lỗi kết nối server");
    }
  }

  async resetPassword(code: string, newPassword: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, newPassword }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Đặt lại mật khẩu thất bại");
      }

      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Lỗi kết nối server");
    }
  }
}

export const passwordResetService = new PasswordResetService();

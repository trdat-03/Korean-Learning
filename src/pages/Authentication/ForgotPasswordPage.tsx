import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForgotPassword } from "@/hooks/authentication/usePasswordReset";
import { ROUTES } from "@/constant/route";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { sendResetCode, isLoading, error, success, reset } = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    await sendResetCode(email);
  };

  const handleContinue = () => {
    // Chuyển đến trang verify code với email
    navigate(`${ROUTES.VERIFY_RESET_CODE}?email=${encodeURIComponent(email)}`);
  };

  const handleBackToLogin = () => {
    reset();
  };

  // Success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-0">
            <CardHeader className="space-y-1">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Mã xác nhận đã được gửi
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Chúng tôi đã gửi mã xác nhận 6 chữ số đến email của bạn
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Vui lòng kiểm tra email <strong>{email}</strong> và nhập mã xác nhận
                </p>
                <p className="text-xs text-gray-500">
                  Mã có hiệu lực trong 5 phút và chỉ sử dụng được 1 lần
                </p>
              </div>
              
              <Button
                onClick={handleContinue}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5"
              >
                Tiếp tục
              </Button>
              
              <Button
                onClick={handleBackToLogin}
                variant="outline"
                className="w-full"
                asChild
              >
                <Link to={ROUTES.LOGIN}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại đăng nhập
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Quên mật khẩu?
              </CardTitle>
              <p className="text-gray-600">
                Nhập email của bạn để nhận mã xác nhận
              </p>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5"
                disabled={isLoading || !email.trim()}
              >
                {isLoading ? "Đang gửi..." : "Gửi mã xác nhận"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                asChild
              >
                <Link to={ROUTES.LOGIN}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại đăng nhập
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>
            Cần hỗ trợ?{" "}
            <Link to="/contact" className="hover:underline">
              Liên hệ với chúng tôi
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

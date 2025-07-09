import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowLeft, CheckCircle, Clock } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useVerifyResetCode } from "@/hooks/authentication/usePasswordReset";
import { ROUTES } from "@/constant/route";

export default function VerifyResetCodePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email") || "";
  
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  
  const { verifyCode, isLoading, error, isValid } = useVerifyResetCode();

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || code.length !== 6) return;
    
    await verifyCode(code);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(value);
  };

  const handleContinue = () => {
    // Chuyển đến trang reset password với code
    navigate(`${ROUTES.RESET_PASSWORD}?code=${code}&email=${encodeURIComponent(email)}`);
  };

  // Redirect if no email
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">Phiên làm việc không hợp lệ</p>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  asChild
                >
                  <Link to={ROUTES.FORGOT_PASSWORD}>
                    Quay lại
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Success state
  if (isValid) {
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
                  Mã xác nhận hợp lệ
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Bạn có thể tiếp tục đặt lại mật khẩu
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleContinue}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5"
              >
                Tiếp tục đặt lại mật khẩu
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
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Nhập mã xác nhận
              </CardTitle>
              <p className="text-gray-600">
                Mã xác nhận đã được gửi đến email <strong>{email}</strong>
              </p>
            </div>
          </CardHeader>
          <CardContent>
            {/* Timer */}
            <div className="mb-4 flex items-center justify-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className={`text-sm font-medium ${timeLeft > 60 ? "text-gray-600" : "text-red-600"}`}>
                Còn lại: {formatTime(timeLeft)}
              </span>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}

            {timeLeft === 0 && (
              <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
                Mã xác nhận đã hết hạn. Vui lòng yêu cầu mã mới.
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-medium">
                  Mã xác nhận (6 chữ số)
                </Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  value={code}
                  onChange={handleCodeChange}
                  className="text-center text-lg font-mono tracking-wider"
                  maxLength={6}
                  required
                  disabled={isLoading || timeLeft === 0}
                />
                <p className="text-xs text-gray-500 text-center">
                  Nhập mã 6 chữ số được gửi đến email của bạn
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5"
                disabled={isLoading || !code.trim() || code.length !== 6 || timeLeft === 0}
              >
                {isLoading ? "Đang xác thực..." : "Xác thực mã"}
              </Button>
            </form>

            <div className="mt-6 space-y-2">
              {/* Resend code button */}
              <Button
                variant="outline"
                className="w-full"
                asChild
              >
                <Link to={ROUTES.FORGOT_PASSWORD}>
                  Gửi lại mã xác nhận
                </Link>
              </Button>

              {/* Back to login */}
              <Button
                variant="ghost"
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
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
            Không nhận được mã? Kiểm tra thư mục spam hoặc{" "}
            <Link to={ROUTES.FORGOT_PASSWORD} className="hover:underline">
              thử lại
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

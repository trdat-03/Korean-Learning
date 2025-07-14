import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Loader2, UserPlus } from "lucide-react";
import { useAdminUsers } from "@/hooks/admin/useAdminUsers";
import { adminUserService } from "@/services/admin/userService";
import { generateAdminUserRoutes } from "@/utils/adminUserRoutes";

export const AdminUserCreate = () => {
  const navigate = useNavigate();
  const { refreshData } = useAdminUsers({ autoLoad: false });

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "STUDENT",
    password: "",
  });

  // Helper function to get role display text
  const getRoleDisplay = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return 'Quản trị viên';
      case 'TEACHER':
        return 'Giáo viên';
      case 'STUDENT':
        return 'Học viên';
      default:
        return role;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setCreating(true);
      setError(null);

      // Basic validation
      if (!formData.fullName.trim() || !formData.email.trim()) {
        setError("Vui lòng điền đầy đủ thông tin bắt buộc");
        return;
      }

      const createData = {
        ...formData,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      };

      await adminUserService.createUser(createData);
      await refreshData();
      navigate(generateAdminUserRoutes.list);
    } catch (err) {
      console.error("Error creating user:", err);
      setError("Không thể tạo người dùng. Vui lòng thử lại.");
    } finally {
      setCreating(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <AdminLayout title="Thêm người dùng mới">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link to={generateAdminUserRoutes.list}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Thêm người dùng mới</h1>
            <p className="text-gray-600">Tạo tài khoản người dùng mới trong hệ thống</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="w-5 h-5 mr-2" />
              Thông tin người dùng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="Nhập họ và tên"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Nhập địa chỉ email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Vai trò *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleInputChange("role", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STUDENT">{getRoleDisplay("STUDENT")}</SelectItem>
                      <SelectItem value="TEACHER">{getRoleDisplay("TEACHER")}</SelectItem>
                      <SelectItem value="ADMIN">{getRoleDisplay("ADMIN")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="password">Mật khẩu *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Nhập mật khẩu"
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Mật khẩu sẽ được gửi đến người dùng qua email
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Link to={generateAdminUserRoutes.list}>
                  <Button type="button" variant="outline">
                    Hủy
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={creating}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {creating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Tạo người dùng
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

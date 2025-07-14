import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Trash2, User, Mail, Phone, Calendar, Loader2 } from "lucide-react";
import { adminUserService } from "@/services/admin/userService";
import type { UserDTO } from "@/models/User";
import { generateAdminUserRoutes } from "@/utils/adminUserRoutes";

export const AdminUserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Helper function to get role badge class
  const getRoleBadgeClass = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'TEACHER':
        return 'bg-blue-100 text-blue-800';
      case 'STUDENT':
        return 'bg-green-100 text-green-800';
      default:
        return '';
    }
  };

  // Helper function to get role badge variant
  const getRoleBadgeVariant = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return 'default';
      case 'TEACHER':
        return 'secondary';
      case 'STUDENT':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const users = await adminUserService.getUsers();
        const foundUser = users.find(u => u.id === parseInt(id));
        
        if (!foundUser) {
          setError("Không tìm thấy người dùng");
          return;
        }

        setUser(foundUser);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Không thể tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleDelete = async () => {
    if (!user || !window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      return;
    }

    try {
      await adminUserService.deleteUser(user.id);
      // Redirect back to user list
      window.location.href = generateAdminUserRoutes.list;
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Không thể xóa người dùng");
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Chi tiết người dùng">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2">Đang tải thông tin...</span>
        </div>
      </AdminLayout>
    );
  }

  if (error || !user) {
    return (
      <AdminLayout title="Chi tiết người dùng">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || "Không tìm thấy người dùng"}</p>
            <Link to={generateAdminUserRoutes.list}>
              <Button variant="outline">
                Quay lại danh sách
              </Button>
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Chi tiết người dùng">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to={generateAdminUserRoutes.list}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{user.fullName}</h1>
              <p className="text-gray-600">Thông tin chi tiết người dùng</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link to={generateAdminUserRoutes.edit(user.id)}>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* User Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Thông tin cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Họ và tên</label>
                    <p className="text-lg font-medium">{user.fullName}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Vai trò</label>
                    <div className="mt-1">
                      <Badge
                        variant={getRoleBadgeVariant(user.role)}
                        className={getRoleBadgeClass(user.role)}
                      >
                        {getRoleDisplay(user.role)}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                  </div>

                  {user.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <div>
                        <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
                        <p className="text-gray-900">{user.phone}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Ngày tạo</label>
                      <p className="text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString("vi-VN", {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">ID người dùng</label>
                    <p className="text-gray-900 font-mono">#{user.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Thao tác nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to={generateAdminUserRoutes.edit(user.id)} className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="w-4 h-4 mr-2" />
                    Chỉnh sửa thông tin
                  </Button>
                </Link>
                
                <Button
                  variant="outline"
                  onClick={handleDelete}
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa người dùng
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

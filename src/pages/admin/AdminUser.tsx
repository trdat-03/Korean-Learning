import { useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { useAdminUsers } from "@/hooks/admin/useAdminUsers";
import { generateAdminUserRoutes } from "@/utils/adminUserRoutes";

export const AdminUser = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    users: students,
    loading,
    error,
    deleteUser,
    refreshData,
  } = useAdminUsers();

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

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleDeleteStudent = async (studentId: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await deleteUser(studentId);
        refreshData();
      } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
      }
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone?.includes(searchTerm)
  );

  if (error) {
    return (
      <AdminLayout title="Quản lý người dùng">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={refreshData} variant="outline">
              Thử lại
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Quản lý người dùng">
      <div className="space-y-4 sm:space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm người dùng..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Link to={generateAdminUserRoutes.create} className="w-full sm:w-auto">
            <Button className="bg-red-600 hover:bg-red-700 w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Thêm người dùng
            </Button>
          </Link>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2">Đang tải dữ liệu...</span>
          </div>
        )}

        {/* Desktop Table */}
        <div className="hidden lg:block border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.fullName}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>
                    <Badge
                      variant={getRoleBadgeVariant(student.role)}
                      className={getRoleBadgeClass(student.role)}
                    >
                      {getRoleDisplay(student.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(student.createdAt).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={generateAdminUserRoutes.detail(student.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={generateAdminUserRoutes.edit(student.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteStudent(student.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {filteredStudents.map((student) => (
            <div key={student.id} className="border rounded-lg p-4 bg-white">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{student.fullName}</div>
                    <p className="text-sm text-gray-500 mt-1">{student.email}</p>
                    {student.phone && (
                      <p className="text-sm text-gray-500">{student.phone}</p>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white">
                      <DropdownMenuItem asChild>
                        <Link to={generateAdminUserRoutes.detail(student.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={generateAdminUserRoutes.edit(student.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteStudent(student.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center justify-between">
                  <Badge
                    variant={getRoleBadgeVariant(student.role)}
                    className={getRoleBadgeClass(student.role)}
                  >
                    {getRoleDisplay(student.role)}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {new Date(student.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && filteredStudents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "Không tìm thấy kết quả" : "Chưa có người dùng nào"}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? `Không tìm thấy người dùng nào với từ khóa "${searchTerm}"`
                : "Hệ thống chưa có người dùng nào. Hãy thêm người dùng đầu tiên."
              }
            </p>
            {searchTerm ? (
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Xóa bộ lọc
              </Button>
            ) : (
              <Link to={generateAdminUserRoutes.create}>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm người dùng đầu tiên
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

import { useState, useEffect } from "react";
import type {Course} from "@/models/Course";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
} from "lucide-react";


export const AdminCourses = () => {
  const [searchTerm, setSearchTerm] = useState("");
   const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
      fetch("http://localhost:8080/api/admin/courses")
        .then((res) => res.json())
        .then((data) => {
          // Thêm field tạm nếu thiếu
          const formatted = data.map((c: Course) => ({
            ...c,
            status: "active", // hoặc inactive nếu muốn
          }));
          setCourses(formatted);
        })
        .catch((error) => {
          console.error("Lỗi khi lấy danh sách học viên:", error);
        });
    }, []);
 
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Quản lý khóa học">
      <div className="space-y-4 sm:space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm khóa học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Link to="/admin/courses/create" className="w-full sm:w-auto">
            <Button className="bg-red-600 hover:bg-red-700 w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Tạo khóa học mới
            </Button>
          </Link>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên khóa học</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Học viên</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>{course.categoryName}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {course.description}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        course.status === "active"
                          ? "bg-green-100 text-green-800"
                          : course.status === "draft"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {course.status === "active"
                        ? "Đang hoạt động"
                        : course.status === "draft"
                        ? "Bản nháp"
                        : "Đã lưu trữ"}
                    </Badge>
                  </TableCell>
                  <TableCell>{course.studentCount}</TableCell>
                  <TableCell>
                    {new Date(course.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/courses/${course.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/courses/${course.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
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
          {filteredCourses.map((course) => (
            <Card key={course.id} className="p-4">
              <CardContent className="p-0">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{course.title}</div>
                      <p className="text-sm text-gray-500 mt-1">
                        {course.description}
                      </p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/courses/${course.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/courses/${course.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Danh mục:</span>
                      <span>{course.categoryName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Học viên:</span>
                      <span>{course.studentCount}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge
                      className={
                        course.status === "active"
                          ? "bg-green-100 text-green-800"
                          : course.status === "draft"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {course.status === "active"
                        ? "Đang hoạt động"
                        : course.status === "draft"
                        ? "Bản nháp"
                        : "Đã lưu trữ"}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(course.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <Link to={`/admin/courses/${course.id}`}>
                      <Button size="sm" variant="outline" className="text-xs">
                        <Eye className="mr-1 h-3 w-3" />
                        Chi tiết
                      </Button>
                    </Link>
                    <Link to={`/admin/courses/${course.id}/edit`}>
                      <Button size="sm" variant="outline" className="text-xs">
                        <Edit className="mr-1 h-3 w-3" />
                        Chỉnh sửa
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

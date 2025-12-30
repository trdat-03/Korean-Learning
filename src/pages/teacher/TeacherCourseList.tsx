import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Users,
  BookOpen,
  Loader2,
  Trash2,
} from 'lucide-react';
import { ROUTES } from '@/constant/route';
import { useTeacherCourses } from '@/hooks/teacher/useTeacherCourses';
import { useTeacherId } from '@/hooks/teacher/useTeacherId';
import { teacherCourseManagementService } from '@/services/teacher/teacherCourseManagementService';

export const TeacherCourseList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingCourseId, setDeletingCourseId] = useState<number | null>(null);
  const { teacherId, isTeacher, currentUser } = useTeacherId();
  
  const { 
    courses, 
    loading, 
    error, 
    actions: { 
      clearError,
      refresh 
    } 
  } = useTeacherCourses({ 
    teacherId: teacherId || 0,
    autoLoad: !!teacherId 
  });

  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.categoryName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }) || [];

  const handleDeleteCourse = async (courseId: number, courseTitle: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa khóa học "${courseTitle}"?\n\nHành động này không thể hoàn tác.`)) {
      return;
    }

    try {
      setDeletingCourseId(courseId);
      await teacherCourseManagementService.deleteCourse(courseId);
      refresh(); // Refresh danh sách sau khi xóa
      alert('Xóa khóa học thành công!');
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Có lỗi xảy ra khi xóa khóa học. Vui lòng thử lại.');
    } finally {
      setDeletingCourseId(null);
    }
  };

  if (!isTeacher || !currentUser) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              {!currentUser ? 'Đang xác thực người dùng...' : 'Bạn không có quyền truy cập trang này.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Đang tải danh sách khóa học...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => { clearError(); refresh(); }} variant="outline">
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Khóa học của tôi</h1>
          <p className="text-gray-600">Quản lý các khóa học bạn đang giảng dạy</p>
        </div>
        <Button asChild>
          <Link to={ROUTES.TEACHER.COURSES.CREATE}>
            <Plus className="w-4 h-4 mr-2" />
            Tạo khóa học mới
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Course Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Tổng khóa học</p>
              <p className="text-xl font-bold">{courses?.length || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <Users className="w-5 h-5 text-green-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Tổng học sinh</p>
              <p className="text-xl font-bold">{courses?.reduce((sum, course) => sum + (course.studentCount || 0), 0) || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Khóa học</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Học sinh</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-gray-600 truncate max-w-xs">
                      {course.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{course.categoryName}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1 text-gray-400" />
                    {course.studentCount}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(course.created_at).toLocaleDateString('vi-VN')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={ROUTES.TEACHER.COURSES.DETAIL.replace(':id', course.id.toString())}>
                          <Eye className="w-4 h-4 mr-2" />
                          Xem chi tiết
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteCourse(course.id, course.title)}
                        className="text-red-600 hover:text-red-700 focus:text-red-700"
                        disabled={deletingCourseId === course.id}
                      >
                        {deletingCourseId === course.id ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-2" />
                        )}
                        {deletingCourseId === course.id ? 'Đang xóa...' : 'Xóa khóa học'}
                      </DropdownMenuItem>
                      {/* Note: Edit action is disabled as it's not yet supported by the backend */}
                      {/* <DropdownMenuItem asChild>
                        <Link to={ROUTES.TEACHER.COURSES.EDIT.replace(':id', course.id.toString())}>
                          <Edit className="w-4 h-4 mr-2" />
                          Chỉnh sửa
                        </Link>
                      </DropdownMenuItem> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy khóa học nào
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Thử thay đổi từ khóa tìm kiếm'
              : 'Bạn chưa tạo khóa học nào. Hãy tạo khóa học đầu tiên của bạn!'}
          </p>
          {!searchTerm && (
            <Button asChild>
              <Link to={ROUTES.TEACHER.COURSES.CREATE}>
                <Plus className="w-4 h-4 mr-2" />
                Tạo khóa học mới
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

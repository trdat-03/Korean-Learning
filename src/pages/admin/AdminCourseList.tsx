import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter } from 'lucide-react';
import { CourseListItem } from '@/components/admin/CourseListItem';
import type { CourseDTO } from '@/services/admin/courseCategoryService';

export default function AdminCourseList() {
  const [courses, setCourses] = useState<CourseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Giả lập dữ liệu khóa học - thay thế bằng API call thực tế
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        // TODO: Thay thế bằng API call thực tế
        // const coursesData = await courseManagementService.getAllCourses();
        
        // Dữ liệu mẫu
        const mockCourses: CourseDTO[] = [
          {
            id: 1,
            title: 'Tiếng Hàn cơ bản cho người mới bắt đầu',
            description: 'Khóa học tiếng Hàn từ cơ bản, bao gồm bảng chữ cái Hangul, từ vựng cơ bản và ngữ pháp căn bản.',
            image: 'https://placehold.co/300x200',
            teacherName: 'Nguyễn Thị Lan',
            categoryName: 'Tiếng Hàn',
            studentCount: 45,
            lessonCount: 20,
            createdAt: '2024-01-15T10:00:00Z'
          },
          {
            id: 2,
            title: 'Tiếng Hàn giao tiếp nâng cao',
            description: 'Khóa học nâng cao kỹ năng giao tiếp tiếng Hàn trong các tình huống thực tế.',
            image: 'https://placehold.co/300x200',
            teacherName: 'Park Min Jun',
            categoryName: 'Tiếng Hàn',
            studentCount: 32,
            lessonCount: 15,
            createdAt: '2024-02-20T14:30:00Z'
          }
        ];
        
        setCourses(mockCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseDeleted = () => {
    // Reload danh sách khóa học sau khi xóa
    window.location.reload();
  };

  const handleEdit = (courseId: number) => {
    // TODO: Navigate to edit page
    console.log('Edit course:', courseId);
  };

  const handleView = (courseId: number) => {
    // TODO: Navigate to view page
    console.log('View course:', courseId);
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.teacherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <AdminLayout title="Quản lý khóa học">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Đang tải...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Quản lý khóa học">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Danh sách khóa học</h1>
            <p className="text-gray-600">Quản lý tất cả khóa học trong hệ thống</p>
          </div>
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4 mr-2" />
            Tạo khóa học mới
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm khóa học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Lọc
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-gray-900">{courses.length}</div>
            <div className="text-sm text-gray-600">Tổng khóa học</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-gray-900">
              {courses.reduce((sum, course) => sum + course.studentCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Tổng học viên</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-gray-900">
              {courses.reduce((sum, course) => sum + course.lessonCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Tổng bài học</div>
          </div>
        </div>

        {/* Course List */}
        <div className="space-y-4">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Không tìm thấy khóa học nào</p>
            </div>
          ) : (
            filteredCourses.map((course) => (
              <CourseListItem
                key={course.id}
                course={course}
                onCourseDeleted={handleCourseDeleted}
                onEdit={handleEdit}
                onView={handleView}
              />
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

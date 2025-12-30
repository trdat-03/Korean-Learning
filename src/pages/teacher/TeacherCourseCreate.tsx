import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeacherId } from '@/hooks/teacher/useTeacherId';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Save, 
  Loader2
} from 'lucide-react';
import { ROUTES } from '@/constant/route';
import { useTeacherCourseFormData } from '@/hooks/teacher/useTeacherCourseFormData';
import { teacherCourseManagementService } from '@/services/teacher/teacherCourseManagementService';

interface TeacherCourseFormData {
  title: string;
  description: string;
  image: string;
  categoryId: string;
}

export default function TeacherCourseCreate() {
  const navigate = useNavigate();
  const { isTeacher, currentUser } = useTeacherId();
  const { categories, currentTeacher, isLoading, error } = useTeacherCourseFormData();
  const [formData, setFormData] = useState<TeacherCourseFormData>({
    title: '',
    description: '',
    image: '',
    categoryId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof TeacherCourseFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid || !isTeacher || !currentUser || !currentTeacher) return;
    
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Vui lòng nhập tên khóa học và mô tả');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const courseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        image: formData.image.trim(),
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        teacherId: currentTeacher.id // Sử dụng ID của teacher đang đăng nhập
      };

      const result = await teacherCourseManagementService.createCourse(courseData);
      
      alert('Tạo khóa học thành công!');
      console.log('Course created:', result);
      
      // Quay lại danh sách khóa học
      navigate(ROUTES.TEACHER.COURSES.LIST);
      
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Có lỗi xảy ra khi tạo khóa học. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.title.trim() && formData.description.trim();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-red-600">
            Lỗi: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.TEACHER.COURSES.LIST)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tạo khóa học mới</h1>
            <p className="text-gray-600">Tạo khóa học giảng dạy cho học sinh của bạn</p>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          className="bg-red-600 hover:bg-red-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Đang tạo...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Tạo khóa học
            </>
          )}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Tên khóa học</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="VD: Tiếng Hàn cơ bản"
                  required
                />
              </div>
              <div>
                <Label htmlFor="categoryId">Danh mục (tùy chọn)</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => handleInputChange('categoryId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Hiển thị thông tin giảng viên */}
              <div>
                <Label>Giảng viên</Label>
                <Input
                  value={currentTeacher?.name || 'Đang tải...'}
                  readOnly
                  className="bg-gray-50 cursor-not-allowed"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Khóa học sẽ được tạo dưới tên: {currentTeacher?.name}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card>
            <CardHeader>
              <CardTitle>Hình ảnh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="image">URL hình ảnh</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="VD: https://example.com/image.jpg"
                />
              </div>
              <div>
                <Label>Xem trước</Label>
                <div className="p-4 bg-gray-100 rounded-md">
                  <img
                    src={formData.image || "https://placehold.co/200x150"}
                    alt="Thumbnail preview"
                    className="w-full object-contain rounded-md"
                    style={{ maxHeight: "150px" }}
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/200x150";
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Mô tả khóa học</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Mô tả chi tiết về khóa học..."
              rows={4}
              required
            />
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

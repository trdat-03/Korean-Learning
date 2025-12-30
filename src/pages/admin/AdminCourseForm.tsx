import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import { useCourseFormData } from "@/hooks/admin/useCourseFormData";
import { courseManagementService } from "@/services/admin/courseManagementService";
import { useState } from "react";

interface CourseFormData {
  title: string;
  description: string;
  image: string;
  teacherId: string;
  categoryId: string;
}

export default function AdminCourseForm() {
  const { categories, teachers, isLoading, error } = useCourseFormData();
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    image: '',
    teacherId: '',
    categoryId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof CourseFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        teacherId: formData.teacherId ? parseInt(formData.teacherId) : null,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null
      };

      const result = await courseManagementService.createCourse(courseData);
      
      alert('Tạo khóa học thành công!');
      console.log('Course created:', result);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        image: '',
        teacherId: '',
        categoryId: ''
      });
      
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Có lỗi xảy ra khi tạo khóa học. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Tạo khóa học mới">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Đang tải dữ liệu...</span>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Tạo khóa học mới">
        <div className="flex items-center justify-center py-8">
          <div className="text-red-600">
            Lỗi: {error}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Tạo khóa học mới">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between">
          <Button type="button" variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <Button 
            type="submit" 
            className="bg-red-600 hover:bg-red-700"
            disabled={isSubmitting}
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
              <div>
                <Label htmlFor="teacherId">Giảng viên (tùy chọn)</Label>
                <Select
                  value={formData.teacherId}
                  onValueChange={(value) => handleInputChange('teacherId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giảng viên" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.value} value={teacher.value}>
                        {teacher.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
    </AdminLayout>
  );
}
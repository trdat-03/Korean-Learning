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
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Upload, 
  X, 
  Plus,
  BookOpen,
  Users,
  Target
} from 'lucide-react';
import { ROUTES } from '@/constant/route';
import type { Course } from '@/models/Course';

interface CourseFormData {
  title: string;
  description: string;
  categoryId: string;
  price: number;
  duration: string;
  level: string;
  tags: string[];
  objectives: string[];
  requirements: string[];
  thumbnail?: File;
  status: Course['status'];
}

const categories = [
  { id: '1', name: 'Cơ Bản' },
  { id: '2', name: 'Trung Cấp' },
  { id: '3', name: 'Cao Cấp' },
  { id: '4', name: 'Ngữ Pháp' },
  { id: '5', name: 'Từ Vựng' },
  { id: '6', name: 'Giao Tiếp' },
];

const levels = [
  { value: 'beginner', label: 'Người mới bắt đầu' },
  { value: 'intermediate', label: 'Trung cấp' },
  { value: 'advanced', label: 'Nâng cao' },
];

export const TeacherCourseCreate: React.FC = () => {
  const navigate = useNavigate();
  const { isTeacher, currentUser } = useTeacherId();
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    categoryId: '',
    price: 0,
    duration: '',
    level: '',
    tags: [],
    objectives: [''],
    requirements: [''],
    status: 'draft',
  });
  const [currentTag, setCurrentTag] = useState('');

  const handleInputChange = (field: keyof CourseFormData, value: string | number | Course['status']) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayAdd = (field: 'objectives' | 'requirements') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const handleArrayChange = (field: 'objectives' | 'requirements', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const handleArrayRemove = (field: 'objectives' | 'requirements', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (status: Course['status']) => {
    if (!isFormValid || !isTeacher || !currentUser) return;
    
    // Course creation is not yet supported by the backend
    alert('Tính năng tạo khóa học mới hiện chưa được hỗ trợ bởi hệ thống backend. Vui lòng thử lại sau.');
    
    // TODO: Implement when backend supports course creation
    console.log('Course creation attempted:', {
      title: formData.title,
      description: formData.description,
      categoryId: Number(formData.categoryId),
      price: formData.price,
      status,
      level: formData.level,
      duration: formData.duration,
      requirements: formData.requirements.filter(req => req.trim()),
      objectives: formData.objectives.filter(obj => obj.trim()),
      tags: formData.tags,
    });
  };

  const isFormValid = formData.title.trim() && formData.description.trim() && formData.categoryId;

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
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => handleSubmit('draft')}
            disabled={!isFormValid}
          >
            <Save className="w-4 h-4 mr-2" />
            Lưu nháp
          </Button>
          <Button
            onClick={() => handleSubmit('active')}
            disabled={!isFormValid}
          >
            <Eye className="w-4 h-4 mr-2" />
            Xuất bản
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Thông tin cơ bản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Tên khóa học *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Nhập tên khóa học..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Mô tả khóa học *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Mô tả chi tiết về khóa học..."
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Danh mục *</Label>
                  <Select value={formData.categoryId} onValueChange={(value) => handleInputChange('categoryId', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="level">Trình độ</Label>
                  <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Chọn trình độ" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Giá khóa học (VND)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', Number(e.target.value))}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="duration">Thời lượng</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="VD: 30 giờ, 10 tuần..."
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Mục tiêu khóa học
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {formData.objectives.map((objective, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={objective}
                      onChange={(e) => handleArrayChange('objectives', index, e.target.value)}
                      placeholder="Nhập mục tiêu..."
                      className="flex-1"
                    />
                    {formData.objectives.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleArrayRemove('objectives', index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleArrayAdd('objectives')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm mục tiêu
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Yêu cầu đầu vào
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {formData.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={requirement}
                      onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                      placeholder="Nhập yêu cầu..."
                      className="flex-1"
                    />
                    {formData.requirements.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleArrayRemove('requirements', index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleArrayAdd('requirements')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm yêu cầu
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="Nhập tag..."
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button size="sm" onClick={handleAddTag}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thumbnail */}
          <Card>
            <CardHeader>
              <CardTitle>Ảnh đại diện</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Kéo thả ảnh hoặc nhấn để chọn
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG tối đa 2MB
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Xem trước</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <Badge variant="outline">Bản nháp</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Danh mục:</span>
                  <span>{categories.find(c => c.id === formData.categoryId)?.name || 'Chưa chọn'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trình độ:</span>
                  <span>{levels.find(l => l.value === formData.level)?.label || 'Chưa chọn'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Giá:</span>
                  <span>{formData.price.toLocaleString('vi-VN')} VND</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

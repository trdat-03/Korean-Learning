import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, Users, BookOpen } from 'lucide-react';
import { DeleteCourseButton } from '@/components/admin/DeleteCourseButton';
import type { CourseDTO } from '@/services/admin/courseCategoryService';

interface CourseListItemProps {
  course: CourseDTO;
  onCourseDeleted?: () => void;
  onEdit?: (courseId: number) => void;
  onView?: (courseId: number) => void;
}

export const CourseListItem: React.FC<CourseListItemProps> = ({
  course,
  onCourseDeleted,
  onEdit,
  onView
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
              {course.title}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Giảng viên: {course.teacherName || 'Chưa phân công'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {onView && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(course.id)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(course.id)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
            <DeleteCourseButton
              courseId={course.id}
              courseName={course.title}
              onDeleted={onCourseDeleted}
              showText={false}
              size="sm"
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <img
              src={imageError ? 'https://placehold.co/120x90' : course.image}
              alt={course.title}
              className="w-30 h-22 object-cover rounded-lg"
              onError={handleImageError}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-700 line-clamp-3 mb-3">
              {course.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {course.studentCount} học viên
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  {course.lessonCount} bài học
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {course.categoryName && (
                  <Badge variant="secondary" className="text-xs">
                    {course.categoryName}
                  </Badge>
                )}
                <Badge 
                  variant="outline" 
                  className="text-xs"
                >
                  {new Date(course.createdAt).toLocaleDateString('vi-VN')}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

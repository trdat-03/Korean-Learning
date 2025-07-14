import React from 'react';
import type {LessonDetailType} from '../../models/LessonDetail';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Book, Clock, GraduationCap, User, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSearchParams } from 'react-router-dom';

interface LessonListProps {
  lessons: LessonDetailType[];
  selectedLessonId: number;
  onSelectLesson: (lesson: LessonDetailType) => void;
}

const LessonList: React.FC<LessonListProps> = ({
  lessons,
  selectedLessonId,
  onSelectLesson,
}) => {
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';

  const canAccessLesson = (lessonIndex: number) => {
    if (isAuthenticated && !isPreview) {
      return true; 
    }
    return lessonIndex < 2; 
  };
  return (
    <Card className="h-full">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold">Nội dung khóa học</CardTitle>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <User className="w-4 h-4" />
          <span>Giảng viên: Alice Teacher</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Book className="w-4 h-4" />
          <span>{lessons.length} bài học</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {lessons.map((lesson, index) => {
            const canAccess = canAccessLesson(index);
            
            return (
              <div
                key={lesson.id}
                className={`p-4 transition-all ${
                  canAccess 
                    ? 'cursor-pointer hover:bg-red-50' 
                    : 'cursor-not-allowed opacity-50 bg-gray-50'
                } ${
                  selectedLessonId === lesson.id
                    ? 'bg-red-100 border-l-4 border-red-600'
                    : ''
                }`}
                onClick={() => canAccess && onSelectLesson(lesson)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium flex items-center gap-2">
                    Bài {lesson.orderNumber}: {lesson.title}
                    {!canAccess && <Lock className="w-4 h-4 text-gray-400" />}
                  </h3>
                  <Badge
                    variant={selectedLessonId === lesson.id ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {canAccess ? 'Có thể học' : 'Cần đăng nhập'}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {/* <span>{lesson.duration}</span> */}
                  </div>
                  <div className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    <span>{lesson.vocabularyCount} từ vựng</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonList; 
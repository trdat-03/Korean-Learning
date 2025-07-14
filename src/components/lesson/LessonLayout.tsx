import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { LessonDetailType } from '@/models/LessonDetail';
import LessonDetail from '@/components/lesson/LessonDetail';
import LessonList from '@/components/lesson/LessonList';
import { Button } from '@/components/ui/button';

interface LessonLayoutProps {
  lessons: LessonDetailType[];
  selectedLesson: LessonDetailType | undefined;
  selectedLessonId: number;
  onSelectLesson: (lesson: LessonDetailType) => void;
  loading?: boolean;
  error?: string | null;
  isPreview?: boolean;
  courseId?: number;
}

export const LessonLayout: React.FC<LessonLayoutProps> = ({
  lessons,
  selectedLesson,
  selectedLessonId,
  onSelectLesson,
  loading,
  error,
  isPreview = false,
  courseId
}) => {
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Banner */}
      {isPreview && (
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-4 px-4 shadow-lg">
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">👀</span>
              <div>
                <h3 className="font-bold text-lg">Bạn đang xem thử khóa học</h3>
                <p className="text-sm opacity-90">Chỉ có thể xem 2 bài học đầu tiên - Đăng nhập để học toàn bộ khóa học</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate(`/courses/${courseId}`)}
              className="mt-2 sm:mt-0 bg-white text-red-600 hover:bg-gray-100 font-bold px-6 py-2 rounded-lg transition"
            >
              Đăng ký khóa học ngay
            </Button>
          </div>
        </div>
      )}
      
      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar bài học */}
          <div className="lg:col-span-4">
            <div className="sticky top-6">
              <LessonList
                lessons={lessons}
                selectedLessonId={selectedLessonId}
                onSelectLesson={onSelectLesson}
              />
            </div>
          </div>

          {/* Nội dung bài học */}
          <div className="lg:col-span-8">
            {selectedLesson ? (
              <LessonDetail lesson={selectedLesson} isPreview={isPreview} courseId={courseId} />
            ) : (
              <p className="text-center text-gray-500">Chưa có bài học nào.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 
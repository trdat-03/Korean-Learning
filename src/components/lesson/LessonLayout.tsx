import React from 'react';
import type { LessonDetailType } from '@/models/LessonDetail';
import LessonDetail from '@/components/lesson/LessonDetail';
import LessonList from '@/components/lesson/LessonList';

interface LessonLayoutProps {
  lessons: LessonDetailType[];
  selectedLesson: LessonDetailType | undefined;
  selectedLessonId: number;
  onSelectLesson: (lesson: LessonDetailType) => void;
  loading?: boolean;
  error?: string | null;
}

export const LessonLayout: React.FC<LessonLayoutProps> = ({
  lessons,
  selectedLesson,
  selectedLessonId,
  onSelectLesson,
  loading,
  error
}) => {
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
              <LessonDetail lesson={selectedLesson} />
            ) : (
              <p className="text-center text-gray-500">Chưa có bài học nào.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 
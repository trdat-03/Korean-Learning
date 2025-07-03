import { useState, useEffect } from 'react';
import { lessonService } from '@/services/features/lessonService';
import type { LessonDetailType } from '@/models/LessonDetail';
import { toast } from 'react-toastify';

export const useLesson = (courseId: number | undefined) => {
  const [lessons, setLessons] = useState<LessonDetailType[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        setError(null);
        const fetchedLessons = await lessonService.getLessonsByCourseId(courseId);
        setLessons(fetchedLessons);

        // Chọn bài đầu tiên mặc định
        if (fetchedLessons.length > 0) {
          setSelectedLessonId(fetchedLessons[0].id);
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách bài học:", err);
        setError("Không thể tải danh sách bài học. Vui lòng thử lại sau.");
        toast.error("Không thể tải danh sách bài học");
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [courseId]);

  const selectedLesson = lessons.find((lesson) => lesson.id === selectedLessonId);

  const handleSelectLesson = (lesson: LessonDetailType) => {
    setSelectedLessonId(lesson.id);
  };

  return {
    lessons,
    selectedLesson,
    selectedLessonId,
    loading,
    error,
    handleSelectLesson
  };
}; 
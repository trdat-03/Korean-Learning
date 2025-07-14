import { useState, useEffect, useCallback } from 'react';
import { 
  adminLessonService, 
  type AdminLessonData, 
  type AdminLessonStats,
  type AdminLessonDetail,
  type AdminLesson,
  type AdminLessonStudent,
  type AdminLessonProgress,
} from '@/services/admin/lessonService';

interface UseAdminLessonsOptions {
  autoLoad?: boolean;
  courseId?: number;
}

export const useAdminLessons = (options: UseAdminLessonsOptions = {}) => {
  const { autoLoad = true, courseId } = options;
  
  const [lessons, setLessons] = useState<AdminLesson[]>([]);
  const [stats, setStats] = useState<AdminLessonStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLessons = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = courseId 
        ? await adminLessonService.getLessonsByCourse(courseId)
        : await adminLessonService.getLessons();
      
      setLessons(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch lessons');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await adminLessonService.getLessonStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch lesson statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  const createLesson = useCallback(async (lessonData: AdminLessonData) => {
    try {
      setLoading(true);
      setError(null);
      
      const newLesson = await adminLessonService.createLesson(lessonData);
      setLessons(prev => [...prev, newLesson]);
      
      return newLesson;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create lesson');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLesson = useCallback(async (lessonId: number, lessonData: Partial<AdminLessonData>) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedLesson = await adminLessonService.updateLesson(lessonId, lessonData);
      setLessons(prev => prev.map(lesson => 
        lesson.id === lessonId ? updatedLesson : lesson
      ));
      
      return updatedLesson;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update lesson');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteLesson = useCallback(async (lessonId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      await adminLessonService.deleteLesson(lessonId);
      setLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete lesson');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reorderLessons = useCallback(async (courseId: number, lessonOrders: { id: number; order: number }[]) => {
    try {
      setLoading(true);
      setError(null);
      
      await adminLessonService.reorderLessons(courseId, lessonOrders);
      // Refresh lessons after reordering
      await fetchLessons();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder lessons');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchLessons]);

  const duplicateLesson = useCallback(async (lessonId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const duplicatedLesson = await adminLessonService.duplicateLesson(lessonId);
      setLessons(prev => [...prev, duplicatedLesson]);
      
      return duplicatedLesson;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to duplicate lesson');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchLessons = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await adminLessonService.searchLessons(query);
      setLessons(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search lessons');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLessonStatus = useCallback(async (lessonId: number, status: 'published' | 'draft' | 'archived') => {
    try {
      setLoading(true);
      setError(null);
      
      await adminLessonService.updateLessonStatus(lessonId, status);
      // Refresh lessons after status update
      await fetchLessons();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update lesson status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchLessons]);

  // Auto-load lessons on mount
  useEffect(() => {
    if (autoLoad) {
      fetchLessons();
    }
  }, [autoLoad, fetchLessons]);

  return {
    lessons,
    stats,
    loading,
    error,
    
    // Actions
    fetchLessons,
    fetchStats,
    createLesson,
    updateLesson,
    deleteLesson,
    reorderLessons,
    duplicateLesson,
    searchLessons,
    updateLessonStatus,
    
    // Utilities
    clearError: () => setError(null),
    refresh: fetchLessons,
  };
};

// Hook for single lesson detail
export const useAdminLessonDetail = (lessonId: number) => {
  const [lesson, setLesson] = useState<AdminLessonDetail | null>(null);
  const [students, setStudents] = useState<AdminLessonStudent[]>([]);
  const [progress, setProgress] = useState<AdminLessonProgress[]>([]);
  const [analytics, setAnalytics] = useState<{
    views: number;
    completions: number;
    averageTimeSpent: number;
    completionRate: number;
    viewsOverTime: Array<{ date: string; views: number }>;
    completionsOverTime: Array<{ date: string; completions: number }>;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLessonDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await adminLessonService.getLessonDetail(lessonId);
      setLesson(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch lesson detail');
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  const fetchLessonStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await adminLessonService.getLessonStudents(lessonId);
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch lesson students');
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  const fetchLessonProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await adminLessonService.getLessonProgress(lessonId);
      setProgress(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch lesson progress');
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  const fetchLessonAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await adminLessonService.getLessonAnalytics(lessonId);
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch lesson analytics');
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  const uploadAttachment = useCallback(async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      
      const attachment = await adminLessonService.uploadAttachment(lessonId, file);
      // Refresh lesson detail to show new attachment
      await fetchLessonDetail();
      
      return attachment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload attachment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [lessonId, fetchLessonDetail]);

  const deleteAttachment = useCallback(async (attachmentId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      await adminLessonService.deleteAttachment(lessonId, attachmentId);
      // Refresh lesson detail to remove attachment
      await fetchLessonDetail();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete attachment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [lessonId, fetchLessonDetail]);

  useEffect(() => {
    if (lessonId) {
      fetchLessonDetail();
      fetchLessonStudents();
      fetchLessonProgress();
      fetchLessonAnalytics();
    }
  }, [lessonId, fetchLessonDetail, fetchLessonStudents, fetchLessonProgress, fetchLessonAnalytics]);

  return {
    lesson,
    students,
    progress,
    analytics,
    loading,
    error,
    
    // Actions
    fetchLessonDetail,
    fetchLessonStudents,
    fetchLessonProgress,
    fetchLessonAnalytics,
    uploadAttachment,
    deleteAttachment,
    
    // Utilities
    clearError: () => setError(null),
    refresh: fetchLessonDetail,
  };
};

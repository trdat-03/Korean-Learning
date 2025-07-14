import { useState, useEffect, useCallback } from 'react';
import { 
  teacherCourseService, 
  type TeacherCourseStats,
  type TeacherCourseStudent
} from '@/services/teacher/courseService';
import type { Course } from '@/models/Course';

interface UseTeacherCoursesOptions {
  autoLoad?: boolean;
  teacherId: number; 
}

export const useTeacherCourses = (options: UseTeacherCoursesOptions) => {
  const { autoLoad = true, teacherId } = options;
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<TeacherCourseStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await teacherCourseService.getCourses(teacherId);
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await teacherCourseService.getCourseStats(teacherId);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch course statistics');
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refresh = useCallback(() => {
    fetchCourses();
    fetchStats();
  }, [fetchCourses, fetchStats]);

  useEffect(() => {
    if (autoLoad) {
      fetchCourses();
      fetchStats();
    }
  }, [autoLoad, fetchCourses, fetchStats]);

  return {
    courses,
    stats,
    loading,
    error,
    actions: {
      fetchCourses,
      fetchStats,
      clearError,
      refresh,
    },
  };
};

// Hook for course students only (the only detail we can get)
export const useTeacherCourseStudents = (courseId: number, teacherId: number) => {
  const [students, setStudents] = useState<TeacherCourseStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await teacherCourseService.getCourseStudents(teacherId, courseId);
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch course students');
    } finally {
      setLoading(false);
    }
  }, [teacherId, courseId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refresh = useCallback(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    if (courseId && teacherId) {
      fetchStudents();
    }
  }, [courseId, teacherId, fetchStudents]);

  return {
    students,
    loading,
    error,
    actions: {
      fetchStudents,
      clearError,
      refresh,
    },
  };
};

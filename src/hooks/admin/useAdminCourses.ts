import { useState, useEffect, useCallback } from 'react';
import { 
  adminCourseService, 
  type AdminCourseData, 
  type AdminCourseDetail,
  type AdminCourseLesson,
  type AdminCourseStudent
} from '@/services/admin/courseService';
import type { Course } from '@/models/Course';

interface UseAdminCoursesOptions {
  autoLoad?: boolean;
  categoryId?: number;
}

export const useAdminCourses = (options: UseAdminCoursesOptions = {}) => {
  const { autoLoad = true, categoryId } = options;
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = categoryId 
        ? await adminCourseService.getCoursesByCategory(categoryId)
        : await adminCourseService.getCourses();
      
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  const createCourse = useCallback(async (courseData: AdminCourseData) => {
    try {
      setLoading(true);
      setError(null);
      
      const newCourse = await adminCourseService.createCourse(courseData);
      setCourses(prev => [...prev, newCourse]);
      
      return newCourse;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create course');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCourse = useCallback(async (courseId: number, courseData: Partial<AdminCourseData>) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedCourse = await adminCourseService.updateCourse(courseId, courseData);
      setCourses(prev => prev.map(course => course.id === courseId ? updatedCourse : course));
      
      return updatedCourse;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update course');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCourse = useCallback(async (courseId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      await adminCourseService.deleteCourse(courseId);
      setCourses(prev => prev.filter(course => course.id !== courseId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete course');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchCourses = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await adminCourseService.searchCourses(query);
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search courses');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refresh = useCallback(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    if (autoLoad) {
      fetchCourses();
    }
  }, [autoLoad, fetchCourses]);

  return {
    courses,
    loading,
    error,
    actions: {
      fetchCourses,
      createCourse,
      updateCourse,
      deleteCourse,
      searchCourses,
      clearError,
      refresh,
    },
  };
};

export const useAdminCourseDetail = (courseId: number) => {
  const [courseDetail, setCourseDetail] = useState<AdminCourseDetail | null>(null);
  const [lessons, setLessons] = useState<AdminCourseLesson[]>([]);
  const [students, setStudents] = useState<AdminCourseStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourseDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await adminCourseService.getCourseDetail(courseId);
      setCourseDetail(data);
      setLessons(data.lessons);
      setStudents(data.students);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch course detail');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refresh = useCallback(() => {
    fetchCourseDetail();
  }, [fetchCourseDetail]);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetail();
    }
  }, [courseId, fetchCourseDetail]);

  return {
    courseDetail,
    lessons,
    students,
    loading,
    error,
    actions: {
      fetchCourseDetail,
      clearError,
      refresh,
    },
  };
};

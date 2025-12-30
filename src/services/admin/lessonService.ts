import api from '@/services/api';

export interface AdminLesson {
  id: number;
  title: string;
  description: string;
  content: string;
  type: 'video' | 'text' | 'audio' | 'interactive';
  duration: number;
  order: number;
  courseId: number;
  courseName: string;
  status: 'published' | 'draft' | 'archived';
  views: number;
  completions: number;
  createdAt: string;
  updatedAt: string;
}

// Interface cho API tạo bài học đơn giản
export interface LessonRequestDTO {
  courseId: number;
  title: string;
}

export interface LessonDetailDTO {
  id: number;
  title: string;
  courseId: number;
  courseName: string;
  orderNumber: number;
  vocabularyCount: number;
  grammarCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLessonData {
  id?: number;
  title: string;
  description: string;
  content: string;
  type: 'video' | 'text' | 'audio' | 'interactive';
  duration: number;
  order: number;
  courseId: number;
  status: 'published' | 'draft' | 'archived';
  videoUrl?: string;
  audioUrl?: string;
  attachments?: string[];
  quiz?: AdminLessonQuiz;
}

export interface AdminLessonQuiz {
  id?: number;
  title: string;
  questions: AdminLessonQuestion[];
  passingScore: number;
  timeLimit?: number;
}

export interface AdminLessonQuestion {
  id?: number;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'essay';
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export interface AdminLessonStats {
  totalLessons: number;
  publishedLessons: number;
  draftLessons: number;
  archivedLessons: number;
  totalViews: number;
  totalCompletions: number;
  averageCompletionRate: number;
}

export interface AdminLessonDetail extends AdminLesson {
  courseTitle: string;
  students: AdminLessonStudent[];
  progress: AdminLessonProgress[];
  quiz?: AdminLessonQuiz;
  attachments: AdminLessonAttachment[];
}

export interface AdminLessonStudent {
  id: number;
  fullName: string;
  email: string;
  startedAt: string;
  completedAt?: string;
  progress: number;
  timeSpent: number;
  quizScore?: number;
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface AdminLessonProgress {
  studentId: number;
  studentName: string;
  progress: number;
  lastAccessed: string;
  timeSpent: number;
  completed: boolean;
}

export interface AdminLessonAttachment {
  id: number;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
  uploadedAt: string;
}

export const adminLessonService = {
  // Get all lessons
  async getLessons(): Promise<AdminLesson[]> {
    const response = await api.get('/admin/lessons');
    return response.data;
  },

  // Get lesson statistics
  async getLessonStats(): Promise<AdminLessonStats> {
    const response = await api.get('/admin/lessons/statistics');
    return response.data;
  },

  // Get lesson detail
  async getLessonDetail(lessonId: number): Promise<AdminLessonDetail> {
    const response = await api.get(`/admin/lessons/${lessonId}`);
    return response.data;
  },

  // Create new lesson
  async createLesson(lessonData: AdminLessonData): Promise<AdminLesson> {
    const response = await api.post('/admin/lessons', lessonData);
    return response.data;
  },

  // Create simple lesson - sử dụng endpoint đúng từ Spring Boot controller
  async createSimpleLesson(data: LessonRequestDTO): Promise<LessonDetailDTO> {
    try {
      console.log('Sending request to /lessons with data:', data);
      const response = await api.post('/lessons', data);
      console.log('Response from server:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in createSimpleLesson:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data: unknown; status: number } };
        console.error('Error response data:', axiosError.response.data);
        console.error('Error response status:', axiosError.response.status);
      }
      throw error;
    }
  },

  // Get simple lesson detail
  async getSimpleLessonDetail(id: number): Promise<LessonDetailDTO> {
    const response = await api.get(`/lessons/${id}`);
    return response.data;
  },

  // Update lesson
  async updateLesson(lessonId: number, lessonData: Partial<AdminLessonData>): Promise<AdminLesson> {
    const response = await api.put(`/admin/lessons/${lessonId}`, lessonData);
    return response.data;
  },

  // Delete lesson
  async deleteLesson(lessonId: number): Promise<void> {
    await api.delete(`/admin/lessons/${lessonId}`);
  },

  // Update lesson status
  async updateLessonStatus(lessonId: number, status: 'published' | 'draft' | 'archived'): Promise<void> {
    await api.patch(`/admin/lessons/${lessonId}/status`, { status });
  },

  // Get lessons by course
  async getLessonsByCourse(courseId: number): Promise<AdminLesson[]> {
    const response = await api.get(`/admin/lessons/course/${courseId}`);
    return response.data;
  },

  // Get lesson students
  async getLessonStudents(lessonId: number): Promise<AdminLessonStudent[]> {
    const response = await api.get(`/admin/lessons/${lessonId}/students`);
    return response.data;
  },

  // Get lesson progress
  async getLessonProgress(lessonId: number): Promise<AdminLessonProgress[]> {
    const response = await api.get(`/admin/lessons/${lessonId}/progress`);
    return response.data;
  },

  // Upload lesson attachment
  async uploadAttachment(lessonId: number, file: File): Promise<AdminLessonAttachment> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`/admin/lessons/${lessonId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete lesson attachment
  async deleteAttachment(lessonId: number, attachmentId: number): Promise<void> {
    await api.delete(`/admin/lessons/${lessonId}/attachments/${attachmentId}`);
  },

  // Reorder lessons
  async reorderLessons(courseId: number, lessonOrders: { id: number; order: number }[]): Promise<void> {
    await api.patch(`/admin/lessons/course/${courseId}/reorder`, { lessonOrders });
  },

  // Duplicate lesson
  async duplicateLesson(lessonId: number): Promise<AdminLesson> {
    const response = await api.post(`/admin/lessons/${lessonId}/duplicate`);
    return response.data;
  },

  // Search lessons
  async searchLessons(query: string): Promise<AdminLesson[]> {
    const response = await api.get('/admin/lessons/search', { params: { q: query } });
    return response.data;
  },

  // Get lesson analytics
  async getLessonAnalytics(lessonId: number): Promise<{
    views: number;
    completions: number;
    averageTimeSpent: number;
    completionRate: number;
    viewsOverTime: Array<{ date: string; views: number }>;
    completionsOverTime: Array<{ date: string; completions: number }>;
  }> {
    const response = await api.get(`/admin/lessons/${lessonId}/analytics`);
    return response.data;
  },
};

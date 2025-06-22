import type { LessonDetailType } from "./LessonDetail";
export interface CourseDetail {
  id: number;
  title: string;
  description: string;
  image: string;
  createdAt: string; // ISO string hoặc bạn có thể chuyển thành Date nếu cần
  teacherName: string;
  categoryName: string;
  studentCount: number;
  lessonCount: number;
  lessons: LessonDetailType[];
}
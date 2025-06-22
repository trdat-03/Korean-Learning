export interface SubCategory {
  id: number;
  title: string;
  description: string;
  createdAt: string | null;
  teacherName: string | null;
  categoryName: string | null;
  studentCount: number;
  lessonCount: number;
}
export interface Course {
  id: number;
  title: string;
  categoryName: string;
  description: string;
  status: "active" | "draft" | "archived";
  studentCount: number;
  created_at: string;
}
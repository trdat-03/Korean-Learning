import type { SubCategory } from "./SubCategory";
export interface CourseCategory {
  id: number;
  name: string;
  subCategories: SubCategory[];
}
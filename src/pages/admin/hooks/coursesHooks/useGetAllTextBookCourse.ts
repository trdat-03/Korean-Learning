import { getAllTextBookCourse } from "@/api/admin/textbook";
import { CourseMaterial } from "@/types/textbook";
import { useQuery } from "@tanstack/react-query";

export const useGetAllTextBookCourse = (id: string) => {
  return useQuery<CourseMaterial[], Error>({
    queryKey: ["getAllTextBookCourse", id],
    queryFn: () => getAllTextBookCourse(id),
  });
};

import { getAllCourses } from "@/api/admin/courses";
import { CourseQueryParams, ICourses } from "@/types/courses";
import { useQuery } from "@tanstack/react-query";

export const useGetAllCourses = (params: CourseQueryParams) => {
  return useQuery<ICourses, Error>({
    queryKey: ["getAllCourses", params],
    queryFn: () => getAllCourses(params),
  });
};

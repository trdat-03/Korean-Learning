import { getCourseDetail } from "@/api/admin/courses";
import { Course } from "@/types/courses";
import { useQuery } from "@tanstack/react-query";

export const useGetCourseDetail = (id: string) => {
  return useQuery<Course, Error>({
    queryKey: ["getCourseDetail", id],
    queryFn: () => getCourseDetail(id),
  });
};

import { getAllVideoCourse } from "@/api/admin/videoCourse";
import { CourseVideo } from "@/types/courses";
import { useQuery } from "@tanstack/react-query";

export const useGetAllVideoCourses = (id: string) => {
  return useQuery<CourseVideo[], Error>({
    queryKey: ["getAllVideoCourse"],
    queryFn: () => getAllVideoCourse(id),
  });
};

import { getAllLivestreamCourse } from "@/api/admin/livestreamCourse";
import { CourseLiveStream } from "@/types/livestream";
import { useQuery } from "@tanstack/react-query";

export const useGetAllLivestreamCourse = (id: string) => {
  return useQuery<CourseLiveStream[], Error>({
    queryKey: ["getAllLivestreamCourse", id],
    queryFn: () => getAllLivestreamCourse(id),
  });
};

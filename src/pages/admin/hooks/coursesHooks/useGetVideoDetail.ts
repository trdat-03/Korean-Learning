import { getVideoDetail } from "@/api/admin/videoCourse";
import { CourseVideo } from "@/types/courses";
import { useQuery } from "@tanstack/react-query";

export const useGetVideoDetail = (id: string) => {
  return useQuery<CourseVideo, Error>({
    queryKey: ["getVideoDetail", id],
    queryFn: () => getVideoDetail(id),
  });
};

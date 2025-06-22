import { getLivestreamDetail } from "@/api/admin/livestreamCourse";
import { CourseLiveStream } from "@/types/livestream";
import { useQuery } from "@tanstack/react-query";

export const useGetLivestreamDetail = (id: string) => {
  return useQuery<CourseLiveStream, Error>({
    queryKey: ["getLivestreamDetail", id],
    queryFn: () => getLivestreamDetail(id),
  });
};

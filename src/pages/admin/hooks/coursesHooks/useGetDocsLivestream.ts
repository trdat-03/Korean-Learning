import { getLivestreamDocument } from "@/api/admin/livestreamCourse";
import { CourseDocument } from "@/types/livestream";
import { useQuery } from "@tanstack/react-query";

export const useGetDocsLivestream = (id: string) => {
  return useQuery<CourseDocument[], Error>({
    queryKey: ["getLivestreamDocument", id],
    queryFn: () => getLivestreamDocument(id),
  });
};

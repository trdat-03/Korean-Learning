import { getTextBookDetail } from "@/api/admin/textbook";
import { CourseMaterial } from "@/types/textbook";
import { useQuery } from "@tanstack/react-query";

export const useGetTextBookDetail = (id: string) => {
  return useQuery<CourseMaterial, Error>({
    queryKey: ["getTextBookDetail", id],
    queryFn: () => getTextBookDetail(id),
  });
};

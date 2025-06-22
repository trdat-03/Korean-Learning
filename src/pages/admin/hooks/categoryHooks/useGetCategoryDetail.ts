import { getCategoriesDetail } from "@/api/admin/categories";
import { ICategory } from "@/types/category";
import { useQuery } from "@tanstack/react-query";

export const useGetCategoryDetail = (id: string) => {
  return useQuery<ICategory, Error>({
    queryKey: ["getAllCategoriesActive", id],
    queryFn: () => getCategoriesDetail(id),
  });
};

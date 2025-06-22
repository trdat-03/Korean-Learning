import { getAllCategoriesActive } from "@/api/admin/categories";
import { getAllCategories } from "@/api/user/categories";
import { ICategory } from "@/types/category";
import { useQuery } from "@tanstack/react-query";

export const useGetAllCategoryActive = () => {
  return useQuery<ICategory[], Error>({
    queryKey: ["getAllCategoriesActive"],
    queryFn: () => getAllCategoriesActive(),
  });
};

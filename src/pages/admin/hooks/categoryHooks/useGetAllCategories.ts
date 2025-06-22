import { getAllCategories } from "@/api/user/categories";
import { ICategory } from "@/types/category";
import { useQuery } from "@tanstack/react-query";

export const useGetAllCategory = () => {
  return useQuery<ICategory[], Error>({
    queryKey: ["getAllCategories"],
    queryFn: () => getAllCategories(),
  });
};

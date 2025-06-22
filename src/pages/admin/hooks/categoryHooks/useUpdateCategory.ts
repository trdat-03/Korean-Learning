import { updateCategory } from "@/api/admin/categories";
import { ICreateCategory } from "@/types/category";
import { validateError } from "@/utils/validate";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
export const useUpdateCategory = (id: string) => {
  return useMutation({
    mutationFn: (values: ICreateCategory) => updateCategory(values, id),
    onSuccess() {
      toast.success("Cập nhật danh mục thành công!");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};

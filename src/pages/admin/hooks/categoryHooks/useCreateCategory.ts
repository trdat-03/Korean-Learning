import { createCategory } from "@/api/admin/categories";
import { ICreateCategory } from "@/types/category";
import { validateError } from "@/utils/validate";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
export const useCreateCategory = () => {
  return useMutation({
    mutationFn: (values: ICreateCategory) => createCategory(values),
    onSuccess() {
      toast.success("Tạo danh mục thành công!");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};

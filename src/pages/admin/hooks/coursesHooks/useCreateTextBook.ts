import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { createTextbook } from "@/api/admin/textbook";
import { ICreateTextBook } from "@/types/textbook";
export const useCreateTextBook = () => {
  return useMutation({
    mutationFn: (data: ICreateTextBook) => createTextbook(data),
    onSuccess() {
      toast.success("Thêm tài liệu thành công");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};

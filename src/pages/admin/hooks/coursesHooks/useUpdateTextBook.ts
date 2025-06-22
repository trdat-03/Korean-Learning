import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { updateTextBookCourse } from "@/api/admin/textbook";
import { IEditTextBook } from "@/types/textbook";
export const useUpdateTextBook = (id: string) => {
  return useMutation({
    mutationFn: (data: IEditTextBook) => updateTextBookCourse(data, id),
    onSuccess() {
      toast.success("Chỉnh sửa tài liệu thành công");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};

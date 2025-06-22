import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { createFileTextbook } from "@/api/admin/textbook";
export const useCreateFileTextBox = (id: string) => {
  return useMutation({
    mutationFn: (data: FormData[]) => createFileTextbook(data, id),
    onSuccess() {
      toast.success("Thêm tài liệu thành công");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};

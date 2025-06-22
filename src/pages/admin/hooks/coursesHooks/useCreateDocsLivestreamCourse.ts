import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { createDocumentLivestream } from "@/api/admin/livestreamCourse";
export const useCreateDocsLivestreamCourse = (id: string) => {
  return useMutation({
    mutationFn: (data: FormData) => createDocumentLivestream(data, id),
    onSuccess() {
      toast.success("Thêm tài liệu thành công");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { updateDocumentLivestream } from "@/api/admin/livestreamCourse";
export const useUpdateDocsLivestreamCourse = (id: string) => {
  return useMutation({
    mutationFn: (data: FormData[]) => updateDocumentLivestream(data, id),
    onSuccess() {
      toast.success("Cập nhật tài liệu thành công");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};

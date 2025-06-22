import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { updateLivestreamCourse } from "@/api/admin/livestreamCourse";
export const useUpdateLivestreamCourse = (id: string) => {
  return useMutation({
    mutationFn: (data: FormData) => updateLivestreamCourse(data, id),
    onSuccess() {
      toast.success("Cập nhật livestream thành công");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};

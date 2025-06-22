import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { createLivestreamCourse } from "@/api/admin/livestreamCourse";
export const useCreateLivestreamCourse = () => {
  return useMutation({
    mutationFn: (data: FormData) => createLivestreamCourse(data),
    onSuccess() {
      toast.success("Thêm video livestream thành công");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};

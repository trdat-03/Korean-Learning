import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { updateCourse } from "@/api/admin/courses";
export const useUpdateCourse = (id: string) => {
  return useMutation({
    mutationFn: (data: FormData) => updateCourse(data, id),
    onSuccess() {
      toast.success("Cập nhật khóa học thành công");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};

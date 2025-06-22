import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { createCourse } from "@/api/admin/courses";
export const useCreateCourse = () => {
  return useMutation({
    mutationFn: (data: FormData) => createCourse(data),
    onSuccess() {
      toast.success("Thêm khóa học thành công");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};

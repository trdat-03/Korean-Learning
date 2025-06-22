import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { createVideoCourse } from "@/api/admin/videoCourse";
export const useCreateVideoCourse = () => {
  return useMutation({
    mutationFn: (data: FormData) => createVideoCourse(data),
    onSuccess() {
      toast.success("Tạo video bài giảng thành công");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};

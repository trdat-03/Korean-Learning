import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { updateVideoCourse } from "@/api/admin/videoCourse";
export const useUpdateVideoCourse = (id: string) => {
  return useMutation({
    mutationFn: (data: FormData) => updateVideoCourse(data, id),
    onSuccess() {
      toast.success("Cập nhật video bài giảng thành công");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};

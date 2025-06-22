import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { deleteVideo } from "@/api/admin/videoCourse";
import {
  deleteDocsLivestream,
  deleteLivestream,
} from "@/api/admin/livestreamCourse";
import { deleteCategory } from "@/api/admin/categories";
import { deleteTextBook } from "@/api/admin/textbook";
export const useDeleteVideo = () => {
  return useMutation({
    mutationFn: (id: string) => deleteVideo(id),
    onSuccess() {
      toast.success("Xóa video thành công");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};

export const useDeleteLivestream = () => {
  return useMutation({
    mutationFn: (id: string) => deleteLivestream(id),
    onSuccess() {
      toast.success("Xóa livestream thành công");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};

export const useDeleteCategory = () => {
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess() {
      toast.success("Xóa danh mục thành công");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};

export const useDeleteDocsLivestream = (idLive: string) => {
  return useMutation({
    mutationFn: (idDocs: string) => deleteDocsLivestream(idLive, idDocs),
    onSuccess() {
      toast.success("Xóa tài liệu thành công");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};

export const useDeleteTextBook = () => {
  return useMutation({
    mutationFn: (id: string) => deleteTextBook(id),
    onSuccess() {
      toast.success("Xóa tài liệu thành công");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};

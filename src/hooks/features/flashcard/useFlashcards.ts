import { useState, useEffect } from "react";
import { flashcardService } from "@/services/features/flashcardService";
import type { LessonDetailType } from "@/models/LessonDetail";
import { toast } from "react-toastify";

export const useFlashcards = (userId: number) => {
  const [flashcards, setFlashcards] = useState<LessonDetailType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await flashcardService.getAll(userId);
      setFlashcards(data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách flashcard:", err);
      setError("Không thể tải danh sách flashcard. Vui lòng thử lại sau.");
      toast.error("Không thể tải danh sách flashcard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFlashcards();
    }
  }, [userId]);

  const createFlashcard = async (flashcard: Partial<LessonDetailType>) => {
    try {
      await flashcardService.create(userId, flashcard);
      toast.success("Tạo flashcard thành công");
      await fetchFlashcards();
    } catch (err) {
      console.error("Lỗi khi tạo flashcard:", err);
      toast.error("Không thể tạo flashcard");
    }
  };

  const updateFlashcard = async (id: number, flashcard: Partial<LessonDetailType>) => {
    try {
      await flashcardService.update(id, flashcard);
      toast.success("Cập nhật flashcard thành công");
      await fetchFlashcards();
    } catch (err) {
      console.error("Lỗi khi cập nhật flashcard:", err);
      toast.error("Không thể cập nhật flashcard");
    }
  };

  const deleteFlashcard = async (id: number) => {
    try {
      await flashcardService.delete(id);
      toast.success("Xóa flashcard thành công");
      await fetchFlashcards();
    } catch (err) {
      console.error("Lỗi khi xóa flashcard:", err);
      toast.error("Không thể xóa flashcard");
    }
  };

  return {
    flashcards,
    isLoading: loading,
    error,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
  };
};

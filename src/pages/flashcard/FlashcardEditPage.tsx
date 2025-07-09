import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { LessonDetailType } from "@/models/LessonDetail";
import { flashcardService } from "@/services/learning/flashcardService";
import { Header } from "@/components/Header";
import { FlashcardForm } from "@/components/flashcard/FlashcardForm";
import { AuthService } from "@/utils/AuthService";

export const FlashcardEditPage = () => {
  const { id } = useParams();
  const [flashcard, setFlashcard] = useState<LessonDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = AuthService.getUser();

  useEffect(() => {
    const fetchFlashcard = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await flashcardService.getById(Number(id));
        setFlashcard(data);
      } catch (err) {
        console.error("Lỗi khi tải flashcard:", err);
        setError("Không thể tải thông tin flashcard. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFlashcard();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !flashcard) {
    return <div className="text-red-500">{error || "Không tìm thấy flashcard"}</div>;
  }

  // Kiểm tra quyền chỉnh sửa
  if (!currentUser || flashcard.creatorId !== currentUser.id) {
    return <div className="text-red-500">Bạn không có quyền chỉnh sửa flashcard này</div>;
  }

  return (
    <>
      <Header />
      <div className="container py-8">
        <FlashcardForm 
          userId={currentUser.id} 
          initialData={flashcard}
        />
      </div>
    </>
  );
}; 
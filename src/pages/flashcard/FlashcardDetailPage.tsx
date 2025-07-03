import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { LessonDetailType } from "@/models/LessonDetail";
import { flashcardService } from "@/services/features/flashcardService";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import LessonDetail from "@/components/features/lesson/LessonDetail";
import { Header } from "@/components/Header";
import { AuthService } from "@/utils/AuthService";

export const FlashcardDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  return (
    <>
    <Header />
    <div className="container py-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </div>
        
        {currentUser && flashcard.creatorId === currentUser.id && (
          <Button
            onClick={() => navigate(`/flashcards/edit/${id}`)}
            variant="outline"
            className="bg-blue-50 text-blue-600 hover:bg-blue-100"
          >
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
        )}
      </div>
      
      <LessonDetail lesson={flashcard} />
    </div>
    </>
  );
}; 
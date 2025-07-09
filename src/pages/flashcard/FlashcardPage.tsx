import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { LessonDetailType } from "@/models/LessonDetail";
import { AuthService } from "@/utils/AuthService";
import { useFlashcards } from "@/hooks/flashcard/useFlashcards";
import { ROUTES } from "@/constant/route";

export const FlashcardPage = () => {
  const user = AuthService.getUser();
  const { flashcards, isLoading, error } = useFlashcards(
    user?.id || 0
  );
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <>
      <Header />
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Flashcards</h1>
          <Button onClick={() => navigate(ROUTES.FLASHCARD.CREATE)}>
            Create New Flashcard
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashcards.map((flashcard: LessonDetailType) => (
            <div
              key={flashcard.id}
              className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
              onClick={() => navigate(ROUTES.FLASHCARD.DETAIL.replace(':id', flashcard.id.toString()))}
            >
              <h2 className="text-xl font-semibold mb-2">{flashcard.title}</h2>
              <p className="text-gray-600"> {flashcard.description}</p>
            </div>
          ))}
          {flashcards.length === 0 && (
            <div className="col-span-full text-center text-gray-500">
              You don't have any flashcards yet. Create your first one!
            </div>
          )}
        </div>
      </div>
    </>
  );
}; 
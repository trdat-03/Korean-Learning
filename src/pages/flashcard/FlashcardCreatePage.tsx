import { Header } from "@/components/Header";
import { FlashcardForm } from "@/components/flashcard/FlashcardForm";
import { AuthService } from "@/utils/AuthService";

export const FlashcardCreatePage = () => {
  const currentUser = AuthService.getUser();

  return (
    <>
      <Header />
      <div className="container py-8">
        <FlashcardForm userId={currentUser?.id} />
      </div>
    </>
  );
}; 
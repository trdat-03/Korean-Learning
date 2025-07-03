import type { LessonDetailType } from "@/models/LessonDetail";
import type { VocabularyItem } from "@/types/vocabulary";
import { z } from "zod";

export interface FlashcardFormProps {
  initialData?: LessonDetailType;
  userId?: number;
}

export const flashcardFormSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
  vocabularies: z
    .array(
      z.object({
        wordKorean: z.string().min(1, "Từ tiếng Hàn không được để trống"),
        wordVietnamese: z.string().min(1, "Nghĩa tiếng Việt không được để trống"),
        exampleSentence: z.string().optional().default(""),
      })
    )
    .min(1, "Phải có ít nhất một từ vựng"),
});

export type FlashcardFormValues = z.infer<typeof flashcardFormSchema>;

export interface VocabularyHeaderProps {
  onAppend: (vocabulary: FlashcardFormValues["vocabularies"][0]) => void;
  aiUsageCount: number;
  userId?: number;
  onAddVocabularies: (vocabularies: VocabularyItem[]) => Promise<void>;
}
 
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { flashcardService } from "@/services/learning/flashcardService";
import type { LessonDetailType } from "@/models/LessonDetail";
import { ROUTES } from "@/constant/route";
import { flashcardFormSchema, type FlashcardFormValues } from "@/types/flashcard";
import { AxiosError } from "axios";
import { userService } from '@/services/system/userService';
import { AuthService } from '@/utils/AuthService';

interface UseFlashcardFormProps {
  initialData?: LessonDetailType;
  userId?: number;
}

export const useFlashcardForm = ({ initialData, userId }: UseFlashcardFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiUsageCount, setAiUsageCount] = useState<number | null>(null);

  const fetchAiUsageCount = async () => {
    let id = userId;
    if (!id) {
      const user = AuthService.getUser();
      id = user?.id;
    }
    if (id) {
      try {
        const count = await userService.getAiUsageCount(id);
        setAiUsageCount(count);
      } catch {
        // Có thể xử lý lỗi ở đây nếu muốn
      }
    }
  };

  useEffect(() => {
    fetchAiUsageCount();
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const form = useForm<FlashcardFormValues>({
    resolver: zodResolver(flashcardFormSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          vocabularies: initialData.vocabularies.map((v) => ({
            wordKorean: v.wordKorean,
            wordVietnamese: v.wordVietnamese,
            exampleSentence: v.exampleSentence,
          })),
        }
      : {
          title: "",
          description: "",
          vocabularies: [
            {
              wordKorean: "",
              wordVietnamese: "",
              exampleSentence: "",
            },
          ],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "vocabularies",
  });

  const transformFormData = (data: FlashcardFormValues): Partial<LessonDetailType> => ({
    title: data.title,
    description: data.description,
    vocabularyCount: data.vocabularies.length,
    grammarCount: 0,
    vocabularies: data.vocabularies.map((v, index) => ({
      id: initialData?.vocabularies[index]?.id || 0,
      wordKorean: v.wordKorean,
      wordVietnamese: v.wordVietnamese,
      exampleSentence: v.exampleSentence || "",
    })),
    grammars: [],
    creatorId: userId,
  });

  const onSubmit = async (data: FlashcardFormValues) => {
    if (!userId) {
      toast.error("Vui lòng đăng nhập để tiếp tục!");
      navigate(ROUTES.LOGIN);
      return;
    }
    try {
      setIsSubmitting(true);
      const transformedData = transformFormData(data);
      if (initialData) {
        await flashcardService.update(initialData.id, transformedData);
        toast.success("Cập nhật flashcard thành công!");
      } else {
        await flashcardService.create(userId, transformedData);
        toast.success("Tạo flashcard thành công!");
      }
      navigate(ROUTES.FLASHCARD.LIST);
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!"
          : "Có lỗi xảy ra. Vui lòng thử lại!";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    fields,
    append,
    remove,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
    aiUsageCount,
    fetchAiUsageCount,
  };
}; 
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft, Save, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AuthService } from "@/utils/AuthService";
import { ImportDialog } from "./ImportDialog";
import { ImageAnalysisDialog } from "./ImageAnalysisDialog";
import { VocabularyItem } from "./VocabularyItem";
import { ROUTES } from "@/constant/route";
import { useFlashcardForm } from "@/hooks/flashcard/useFlashcardForm";
import type { FlashcardFormProps, VocabularyHeaderProps } from "@/types/flashcard";
import { AlertAiUsageCount } from "@/components/ui/AlertAiUsageCount";

const FlashcardHeader = ({ isEditing }: { isEditing: boolean }) => (
  <CardHeader>
    <CardTitle className="text-2xl font-bold">
      {isEditing ? "Chỉnh sửa Flashcard" : "Tạo Flashcard mới"}
    </CardTitle>
  </CardHeader>
);

const VocabularyHeader = ({
  onAppend,
  aiUsageCount,
  userId,
  onAddVocabularies,
}: VocabularyHeaderProps) => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-semibold">Danh sách từ vựng</h3>
      <div className="flex gap-2">
        <ImportDialog onImport={(vocabularies) => vocabularies.forEach(onAppend)} />
        <ImageAnalysisDialog 
          onAddVocabularies={onAddVocabularies}
          aiUsageCount={aiUsageCount}
          userId={userId}
        />
        <Button
          type="button"
          onClick={() =>
            onAppend({ wordKorean: "", wordVietnamese: "", exampleSentence: "" })
          }
          variant="outline"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Thêm từ vựng đi
        </Button> 
      </div>
    </div>
    <AlertAiUsageCount aiUsageCount={aiUsageCount} />
  </div>
);


const FormActions = ({ isSubmitting, isEditing }: { isSubmitting: boolean; isEditing: boolean }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-end gap-4 pt-6">
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate(ROUTES.FLASHCARD.LIST)}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="gap-2 min-w-[120px]"
      >
        {isSubmitting && <Loader2 className="animate-spin h-4 w-4" />}
        <Save className="h-4 w-4" />
        {isEditing ? "Cập nhật" : "Tạo mới"}
      </Button>
    </div>
  );
};

export function FlashcardForm({ initialData, userId }: FlashcardFormProps) {
  const navigate = useNavigate();
  const currentUser = AuthService.getUser();
  const actualUserId = userId || currentUser?.id;

  const {
    form,
    fields,
    append,
    remove,
    isSubmitting,
    onSubmit,
    aiUsageCount,
    fetchAiUsageCount
  } = useFlashcardForm({
    initialData,
    userId: actualUserId,
  });

    const { toast } = useToast();

  useEffect(() => {
    if (!actualUserId) {
      // toast.error("Vui lòng đăng nhập để tiếp tục!");
      navigate(ROUTES.LOGIN);
    }
  }, [actualUserId, navigate]);

  if (!actualUserId) return null;

  return (
    <Card className="max-w-4xl mx-auto">
      <FlashcardHeader isEditing={!!initialData} />
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-8">
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Tiêu đề</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tiêu đề flashcard" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Mô tả</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập mô tả cho flashcard"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-8" />

            <div className="space-y-6">
              <VocabularyHeader
                  onAppend={append}
                  aiUsageCount={aiUsageCount || 0}
                  userId={actualUserId}
                  onAddVocabularies={async (vocabularies) => {
                    if ((aiUsageCount ?? 0) <= 0) {
                      toast({
                        variant: "destructive",
                        title: "Hết lượt sử dụng AI",
                        description:
                          "Bạn đã hết lượt sử dụng AI. Vui lòng nâng cấp tài khoản để tiếp tục luyện tập. Hoặc đợi sang ngày mai để nhận lượt sử dụng miễn phí.",
                      });
                      return;
                    }
                    vocabularies.forEach((v) =>
                      append({
                        wordKorean: v.wordKorean,
                        wordVietnamese: v.wordVietnamese,
                        exampleSentence: v.exampleSentence || "",
                      })
                    );
                    // Fetch updated AI usage count after analysis
                    await fetchAiUsageCount();
                  }}
                />
              <div className="grid gap-6">
                {fields.map((field, index) => (
                  <VocabularyItem
                    key={field.id}
                    index={index}
                    remove={remove}
                    disableRemove={fields.length === 1}
                    control={form.control}
                  />
                ))}
              </div>
            </div>

            <FormActions isSubmitting={isSubmitting} isEditing={!!initialData} />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

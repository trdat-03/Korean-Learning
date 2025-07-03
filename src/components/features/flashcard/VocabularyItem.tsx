import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Control } from "react-hook-form";
import type { FlashcardFormValues } from "@/types/flashcard";

export function VocabularyItem({
  index,
  remove,
  disableRemove,
  control,
}: {
  index: number;
  remove: (index: number) => void;
  disableRemove: boolean;
  control: Control<FlashcardFormValues>;
}) {
  return (
    <Card className="relative">
      <CardContent className="pt-6">
        <div className="absolute right-4 top-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(index)}
            disabled={disableRemove}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`vocabularies.${index}.wordKorean`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Từ tiếng Hàn</FormLabel>
                  <FormControl>
                    <Input placeholder="예: 안녕하세요" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`vocabularies.${index}.wordVietnamese`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nghĩa tiếng Việt</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Xin chào" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={control}
            name={`vocabularies.${index}.exampleSentence`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Câu ví dụ (không bắt buộc nha)</FormLabel>
                <FormControl>
                  <Textarea placeholder="VD: 안녕하세요, 저는 민수입니다." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}

import type { LessonDetailType } from '@/models/LessonDetail';
import type { Vocabulary } from '@/models/Vocabulary';
import type { MatchingItem } from '@/types/vocabulary-matching';
import { shuffle } from '@/lib/utils';

export const generateMatchingItems = (
  lesson: LessonDetailType,
  vocabularyCount: number
): MatchingItem[] => {
  const selectedVocabs = shuffle([...lesson.vocabularies]).slice(0, vocabularyCount);
  const items: MatchingItem[] = [];

  selectedVocabs.forEach((vocab: Vocabulary) => {
    // Add Korean word
    items.push({
      id: `k-${vocab.id}`,
      text: vocab.wordKorean,
      type: 'korean',
      isSelected: false,
      isMatched: false,
      matchedWithId: null,
    });
    // Add Vietnamese meaning
    items.push({
      id: `v-${vocab.id}`,
      text: vocab.wordVietnamese,
      type: 'vietnamese',
      isSelected: false,
      isMatched: false,
      matchedWithId: null,
    });
  });

  return shuffle(items);
};

export const checkMatch = (selectedItem: MatchingItem, currentItem: MatchingItem): boolean => {
  return selectedItem.id.substring(2) === currentItem.id.substring(2) && 
         selectedItem.type !== currentItem.type;
}; 
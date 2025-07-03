export interface MatchingItem {
  id: string;
  text: string;
  type: 'korean' | 'vietnamese';
  isSelected: boolean;
  isMatched: boolean;
  matchedWithId: string | null;
}

export interface VocabularyMatchingState {
  timeElapsed: number;
  isStarted: boolean;
  isFinished: boolean;
  matchingItems: MatchingItem[];
  selectedItem: MatchingItem | null;
} 
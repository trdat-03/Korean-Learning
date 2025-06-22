import type { Vocabulary } from './Vocabulary';
import type { Grammar } from './Grammar';

export interface LessonDetailType {
  id: number;
  title: string;
  orderNumber: number;
  vocabularyCount: number;
  grammarCount: number;
  vocabularies: Vocabulary[];
  grammars: Grammar[];
}
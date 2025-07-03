import type { VocabularyItem } from './vocabulary';

export interface AnalyzeImageResponse {
  success: boolean;
  message?: string;
  vocabularyItems?: VocabularyItem[];
  vocabularyCount: number;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  message: string;
} 
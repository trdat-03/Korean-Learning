export interface VocabularyItem {
    wordKorean: string;
    wordVietnamese: string;
    exampleSentence?: string;
}

export interface VocabularyAnalysisResponse {
    success: boolean;
    message?: string;
    vocabularyItems?: VocabularyItem[];
    vocabularyCount?: number;
}

export interface AnalyzeImageResponse {
    success: boolean;
    message?: string;
    vocabularyItems: VocabularyItem[] | null;
    vocabularyCount: number;
}

export interface SupportedFormatsResponse {
    formats: string[];
}

export interface HealthCheckResponse {
    status: 'healthy' | 'unhealthy';
    message: string;
}
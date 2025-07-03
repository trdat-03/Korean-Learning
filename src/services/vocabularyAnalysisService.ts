import api from './api';
import type { AnalyzeImageResponse, HealthCheckResponse } from '../types/analysis';
import { AxiosError } from 'axios';

export const vocabularyAnalysisService = {
  // Analyze image to extract Korean vocabulary
  analyzeImage: async (imageFile: File, maxResults: number = 10, userId?: number): Promise<AnalyzeImageResponse> => {
    try {

      if (!userId) {
        throw new Error('User ID là bắt buộc để phân tích hình ảnh');
      }

      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("maxResults", maxResults.toString());
      formData.append("userId", userId.toString());

      const response = await api.post<AnalyzeImageResponse>(
        "/vocabulary/analyze-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000, // 30 second timeout for image processing
        }
      );

      return {
        ...response.data,
        vocabularyCount: response.data.vocabularyCount || 0,
      };
    } catch (error: unknown) {
      console.error('Error analyzing image:', error);
      
      // Handle specific error cases
      if (error instanceof AxiosError && error.response?.data?.message) {
        return {
          success: false,
          vocabularyCount: 0,
          message: error.response.data.message,
        };
      }

      // Handle network or other errors
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while analyzing the image';
      return {
        success: false,
        vocabularyCount: 0,
        message: errorMessage,
      };
    }
  },

  // Check service health status
  checkHealth: async (): Promise<HealthCheckResponse> => {
    try {
      const response = await api.get('/vocabulary/health');
      console.log('Health Check Response:', response.data);
      
      return {
        status: 'healthy',
        message: response.data,
      };
    } catch (error: unknown) {
      console.error('Error checking service health:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Service is not available';
      return {
        status: 'unhealthy',
        message: errorMessage,
      };
    }
  },
}; 
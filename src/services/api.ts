import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      console.error('Access forbidden');
    } else if (error.response?.status >= 500) {
      console.error('Server error:', error.response.status);
    }
    
    // Log errors in development
    if (import.meta.env.DEV) {
      console.error('API Error:', error);
    }
    
    return Promise.reject(error);
  }
);

export interface TestResultResponse {
  currentScore: number;
  previousScore: number | null;
  feedbackMessage: string;
  lastFiveResults: {
    lessonId: string;
    scorePercentage: number;
    testDate: string;
  }[];
}

export const submitTestResult = async (
  userId: string,
  lessonId: string,
  scorePercentage: number
): Promise<TestResultResponse> => {
  const response = await api.post(
    `/test-results/submit-with-feedback?userId=${userId}&lessonId=${lessonId}&scorePercentage=${scorePercentage}`
  );
  return response.data;
};

export default api; 
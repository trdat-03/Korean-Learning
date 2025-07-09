import api from '../api';
import type { 
  Certificate, 
  CreateCertificateRequest, 
  CreateCertificateResponse, 
  GetCertificatesResponse,
  CertificateGrade,
  CertificateCreationData
} from '@/types/certificate';

export const certificateService = {
  /**
   * Tạo chứng chỉ mới
   * @param userId - ID người dùng
   * @param request - Thông tin chứng chỉ
   * @returns Promise<Certificate>
   */
  createCertificate: async (
    userId: number, 
    request: CreateCertificateRequest
  ): Promise<Certificate> => {
    try {
      const response = await api.post<CreateCertificateResponse>(
        `/certificates/create/${userId}`,
        request
      );
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Không thể tạo chứng chỉ');
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data?: { message?: string } } };
        throw new Error(axiosError.response.data?.message || 'Lỗi khi tạo chứng chỉ');
      }
      throw error;
    }
  },

  /**
   * Lấy danh sách chứng chỉ của người dùng
   * @param userId - ID người dùng
   * @returns Promise<Certificate[]>
   */
  getUserCertificates: async (userId: number): Promise<Certificate[]> => {
    try {
      const response = await api.get<GetCertificatesResponse>(
        `/certificates/user/${userId}`
      );
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Không thể lấy danh sách chứng chỉ');
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data?: { message?: string } } };
        throw new Error(axiosError.response.data?.message || 'Lỗi khi lấy danh sách chứng chỉ');
      }
      throw error;
    }
  },

  /**
   * Tính toán loại chứng chỉ dựa trên điểm số
   * @param score - Điểm số (0-100)
   * @returns CertificateGrade | null
   */
  calculateGrade: (score: number): CertificateGrade | null => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return null; // Không đủ điều kiện nhận chứng chỉ
  },

  /**
   * Tạo mô tả chứng chỉ dựa trên điểm và loại
   * @param score - Điểm số
   * @param grade - Loại chứng chỉ
   * @returns string
   */
  generateDescription: (score: number, grade: CertificateGrade): string => {
    const descriptions = {
      A: `Hoàn thành xuất sắc khóa học với ${score}% điểm số. Thành tích đáng khen ngợi!`,
      B: `Hoàn thành tốt khóa học với ${score}% điểm số. Kết quả ấn tượng!`,
      C: `Hoàn thành khóa học với ${score}% điểm số. Nỗ lực đáng ghi nhận!`,
      D: `Hoàn thành cơ bản khóa học với ${score}% điểm số. Tiếp tục phát huy!`
    };
    return descriptions[grade];
  },

  /**
   * Tạo chứng chỉ tự động sau khi hoàn thành quiz
   * @param data - Thông tin để tạo chứng chỉ
   * @returns Promise<Certificate | null>
   */
  createCertificateFromQuiz: async (data: CertificateCreationData): Promise<Certificate | null> => {
    const { userId, courseId, courseTitle, score, userName } = data;
    
    // Tính toán loại chứng chỉ
    const grade = certificateService.calculateGrade(score);
    
    // Nếu không đủ điều kiện, trả về null
    if (!grade) {
      console.log(`Điểm số ${score}% không đủ điều kiện nhận chứng chỉ (cần tối thiểu 60%)`);
      return null;
    }

    try {
      // Tạo chứng chỉ
      const certificate = await certificateService.createCertificate(userId, {
        courseId,
        grade,
        description: certificateService.generateDescription(score, grade)
      });

      console.log(`Đã tạo chứng chỉ loại ${grade} cho ${userName} - Khóa học: ${courseTitle}`);
      return certificate;
    } catch (error) {
      console.error('Lỗi khi tạo chứng chỉ:', error);
      
      // Nếu lỗi là do đã có chứng chỉ, không cần báo lỗi
      if (error instanceof Error && error.message.includes('đã có chứng chỉ')) {
        console.log('Người dùng đã có chứng chỉ cho khóa học này');
        return null;
      }
      
      // Với các lỗi khác, throw để caller xử lý
      throw error;
    }
  }
};

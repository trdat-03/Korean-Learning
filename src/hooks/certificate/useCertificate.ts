import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { certificateService } from '@/services/system/certificateService';
import type { Certificate, CertificateCreationData } from '@/types/certificate';

export const useCertificate = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Lấy danh sách chứng chỉ của người dùng
   * @param userId - ID người dùng
   */
  const fetchUserCertificates = useCallback(async (userId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await certificateService.getUserCertificates(userId);
      setCertificates(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi khi lấy danh sách chứng chỉ';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Tạo chứng chỉ từ kết quả quiz
   * @param data - Thông tin tạo chứng chỉ
   * @returns Promise<Certificate | null>
   */
  const createCertificateFromQuiz = useCallback(async (data: CertificateCreationData): Promise<Certificate | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const certificate = await certificateService.createCertificateFromQuiz(data);
      
      if (certificate) {
        // Cập nhật danh sách chứng chỉ
        setCertificates(prev => [certificate, ...prev]);
        
        // Thông báo thành công
        toast.success(
          `🎉 Chúc mừng! Bạn đã nhận được chứng chỉ loại ${certificate.grade} cho khóa học "${data.courseTitle}"`,
          {
            autoClose: 5000,
            className: 'certificate-toast'
          }
        );
        
        return certificate;
      } else {
        // Điểm không đủ để nhận chứng chỉ
        toast.info(
          `Điểm số ${data.score}% chưa đủ điều kiện nhận chứng chỉ (cần tối thiểu 60%). Hãy cố gắng lần sau!`,
          {
            autoClose: 4000
          }
        );
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi khi tạo chứng chỉ';
      setError(errorMessage);
      
      // Không hiển thị toast error nếu là lỗi đã có chứng chỉ
      if (!errorMessage.includes('đã có chứng chỉ')) {
        toast.error(errorMessage);
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reset trạng thái
   */
  const resetState = useCallback(() => {
    setCertificates([]);
    setError(null);
    setLoading(false);
  }, []);

  return {
    certificates,
    loading,
    error,
    fetchUserCertificates,
    createCertificateFromQuiz,
    resetState
  };
};

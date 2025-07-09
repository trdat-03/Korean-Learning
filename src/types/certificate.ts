export interface Certificate {
  id: number;
  certificateCode: string;
  completedAt: string;
  issuedAt: string;
  grade: string;
  description: string;
  isActive: boolean;
  userId: number;
  userName: string;
  courseId: number;
  courseTitle: string;
}

export interface CreateCertificateRequest {
  courseId: number;
  grade: string;
  description: string;
}

export interface CreateCertificateResponse {
  success: boolean;
  message: string;
  data: Certificate;
}

export interface GetCertificatesResponse {
  success: boolean;
  message: string;
  data: Certificate[];
  total: number;
}

export interface CertificateError {
  success: false;
  error: string;
  message: string;
}

export type CertificateGrade = 'A' | 'B' | 'C' | 'D';

export interface CertificateCreationData {
  userId: number;
  courseId: number;
  courseTitle: string;
  score: number;
  userName: string;
}

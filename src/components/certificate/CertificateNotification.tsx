import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, Download, Eye } from 'lucide-react';
import type { Certificate } from '@/types/certificate';

interface CertificateNotificationProps {
  certificate: Certificate;
  onViewCertificate?: (certificate: Certificate) => void;
  onDownloadCertificate?: (certificate: Certificate) => void;
}

export const CertificateNotification: React.FC<CertificateNotificationProps> = ({
  certificate,
  onViewCertificate,
  onDownloadCertificate
}) => {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800 border-green-200';
      case 'B': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'C': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'D': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getGradeText = (grade: string) => {
    switch (grade) {
      case 'A': return 'Xuất sắc';
      case 'B': return 'Tốt';
      case 'C': return 'Khá';
      case 'D': return 'Đạt';
      default: return grade;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Award className="h-6 w-6 text-yellow-600" />
          🎉 Chúc mừng! Bạn đã nhận được chứng chỉ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Khóa học:</p>
            <p className="font-medium">{certificate.courseTitle}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Loại chứng chỉ:</p>
            <Badge className={getGradeColor(certificate.grade)}>
              {getGradeText(certificate.grade)}
            </Badge>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">Mã chứng chỉ:</p>
          <p className="font-mono text-sm bg-gray-100 p-2 rounded border">
            {certificate.certificateCode}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">Ngày cấp:</p>
          <p className="text-sm">{formatDate(certificate.issuedAt)}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">Mô tả:</p>
          <p className="text-sm text-gray-700">{certificate.description}</p>
        </div>

        <div className="flex gap-2 pt-2">
          {onViewCertificate && (
            <Button
              onClick={() => onViewCertificate(certificate)}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Eye className="h-4 w-4" />
              Xem chứng chỉ
            </Button>
          )}
          {onDownloadCertificate && (
            <Button
              onClick={() => onDownloadCertificate(certificate)}
              size="sm"
              className="flex items-center gap-1 bg-yellow-600 hover:bg-yellow-700"
            >
              <Download className="h-4 w-4" />
              Tải xuống
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

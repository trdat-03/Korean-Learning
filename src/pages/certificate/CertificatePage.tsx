import React, { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Calendar, BookOpen, AlertTriangle } from 'lucide-react';
import { AuthService } from '@/utils/AuthService';
import { useCertificate } from '@/hooks/certificate/useCertificate';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const CertificatePage: React.FC = () => {
  const navigate = useNavigate();
  const { certificates, loading, error, fetchUserCertificates } = useCertificate();
  
  // Lấy user từ AuthService
  const user = AuthService.getUser();
  const isAuthenticated = AuthService.isLoggedIn();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    
    // Chỉ fetch khi có user và chưa có certificates
    if (certificates.length === 0 && !loading && !error) {
      fetchUserCertificates(user.id);
    }
  }, [user, isAuthenticated, navigate, fetchUserCertificates, certificates.length, loading, error]);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300';
      case 'B': return 'bg-gradient-to-r from-rose-100 to-rose-200 text-rose-800 border-rose-300';
      case 'C': return 'bg-gradient-to-r from-pink-100 to-pink-200 text-pink-800 border-pink-300';
      case 'D': return 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 border-slate-300';
      case 'F': return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
    }
  };

  const getGradeText = (grade: string) => {
    switch (grade) {
      case 'A': return 'Xuất sắc';
      case 'B': return 'Giỏi';
      case 'C': return 'Khá';
      case 'D': return 'Trung bình';
      case 'F': return 'Yếu';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Skeleton className="h-14 w-14 rounded-full" />
              <Skeleton className="h-10 w-64" />
            </div>
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 bg-white/90 backdrop-blur-sm overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="h-2 bg-gradient-to-r from-red-400 to-rose-400 animate-pulse"></div>
                <CardHeader className="pb-4 pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Skeleton className="h-7 w-7 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-5 w-full" />
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Skeleton className="h-7 w-7 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-5 w-24" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-12 w-full rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Skeleton className="h-9 flex-1 rounded-md" />
                    <Skeleton className="h-9 flex-1 rounded-md" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Card className="max-w-md mx-auto text-center py-16 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="space-y-6">
                <div className="p-4 bg-gradient-to-br from-red-100 to-rose-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center shadow-lg">
                  <AlertTriangle className="h-10 w-10 text-red-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-gray-800">Có lỗi xảy ra</h3>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
                <Button 
                  onClick={() => {
                    if (user) {
                      fetchUserCertificates(user.id);
                    }
                  }}
                  className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Thử lại
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-red-500 to-rose-500 rounded-full shadow-lg">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              Chứng chỉ của tôi
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Danh sách các chứng chỉ bạn đã đạt được từ các khóa học
          </p>
        </div>

        {certificates.length === 0 ? (
          <Card className="max-w-md mx-auto text-center py-16 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="space-y-6">
              <div className="p-4 bg-gradient-to-br from-red-100 to-rose-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center shadow-lg">
                <Award className="h-10 w-10 text-red-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-gray-800">Chưa có chứng chỉ nào</h3>
                <p className="text-gray-600">
                  Hoàn thành các bài kiểm tra để nhận chứng chỉ đầu tiên của bạn
                </p>
              </div>
              <Button 
                onClick={() => navigate('/courses')}
                className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Khám phá khóa học
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((certificate) => (
              <Card key={certificate.id} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm hover:bg-white/95 overflow-hidden shadow-lg hover:scale-105">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500"></div>
                
                <CardHeader className="pb-4 pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg shadow-md">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-800">Chứng chỉ</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">Hoàn thành khóa học</p>
                      </div>
                    </div>
                    <Badge className={`${getGradeColor(certificate.grade)} font-semibold px-3 py-1 shadow-sm`}>
                      {getGradeText(certificate.grade)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-5">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-gradient-to-r from-red-100 to-rose-100 rounded-lg mt-0.5 shadow-sm">
                        <BookOpen className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">Khóa học</p>
                        <p className="font-semibold text-gray-800 leading-tight">{certificate.courseTitle}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-gradient-to-r from-rose-100 to-pink-100 rounded-lg mt-0.5 shadow-sm">
                        <Calendar className="h-4 w-4 text-rose-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">Ngày cấp</p>
                        <p className="text-gray-800">{formatDate(certificate.issuedAt)}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Mã chứng chỉ</p>
                      <div className="bg-gradient-to-r from-red-50 to-rose-50 p-3 rounded-lg border border-red-200 shadow-sm">
                        <p className="font-mono text-sm text-red-700 break-all">
                          {certificate.certificateCode}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Mô tả</p>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                        {certificate.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificatePage;

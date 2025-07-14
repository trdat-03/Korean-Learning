import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface LessonAccessGuardProps {
  children: React.ReactNode;
  courseId: number;
  onUnauthorized?: () => void;
}

export const LessonAccessGuard: React.FC<LessonAccessGuardProps> = ({
  children,
  courseId,
  onUnauthorized
}) => {
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isPreview = searchParams.get('preview') === 'true';

  useEffect(() => {
    if (!isPreview && !isAuthenticated) {
      if (onUnauthorized) {
        onUnauthorized();
      } else {
        navigate(`/courses/${courseId}`);
      }
    }
  }, [isPreview, isAuthenticated, courseId, navigate, onUnauthorized]);

  if (isAuthenticated || isPreview) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
      </div>
    </div>
  );
};

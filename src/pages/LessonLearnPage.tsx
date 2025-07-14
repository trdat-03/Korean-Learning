import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { LessonLayout } from '@/components/lesson/LessonLayout';
import { LessonAccessGuard } from '@/components/lesson/LessonAccessGuard';
import { LoginPromptDialog } from '@/components/LoginPromptDialog';
import { useLesson } from '@/hooks/lesson/useLesson';
import { useAuth } from '@/hooks/useAuth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const LessonLearnPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const courseId = id ? parseInt(id, 10) : undefined;
  const isPreview = searchParams.get('preview') === 'true';
  
  const {
    lessons,
    selectedLesson,
    selectedLessonId,
    loading,
    error,
    handleSelectLesson
  } = useLesson(courseId);

  useEffect(() => {
    if (!isPreview && !isAuthenticated) {
      setShowLoginPrompt(true);
    }
  }, [isPreview, isAuthenticated]);

  const displayLessons = (!isAuthenticated || isPreview) ? lessons.slice(0, 2) : lessons;

  if (!courseId) {
    return <div className="text-center py-10">Không tìm thấy khóa học.</div>;
  }

  return (
    <>
      <Header />
      <ToastContainer position="top-center" />
      
      <LessonAccessGuard 
        courseId={courseId} 
        onUnauthorized={() => setShowLoginPrompt(true)}
      >
        <LessonLayout
          lessons={displayLessons}
          selectedLesson={selectedLesson}
          selectedLessonId={selectedLessonId ?? 0}
          onSelectLesson={handleSelectLesson}
          loading={loading}
          error={error}
          isPreview={isPreview || !isAuthenticated}
          courseId={courseId}
        />
      </LessonAccessGuard>
      
      <LoginPromptDialog
        open={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
      />
    </>
  );
};

export default LessonLearnPage;

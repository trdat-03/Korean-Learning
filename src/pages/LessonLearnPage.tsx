import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { LessonLayout } from '@/components/features/lesson/LessonLayout';
import { useLesson } from '@/hooks/features/lesson/useLesson';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const LessonLearnPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const courseId = id ? parseInt(id, 10) : undefined;
  
  const {
    lessons,
    selectedLesson,
    selectedLessonId,
    loading,
    error,
    handleSelectLesson
  } = useLesson(courseId);

  return (
    <>
      <Header />
      <ToastContainer position="top-center" />
      <LessonLayout
        lessons={lessons}
        selectedLesson={selectedLesson}
        selectedLessonId={selectedLessonId ?? 0}
        onSelectLesson={handleSelectLesson}
        loading={loading}
        error={error}
      />
    </>
  );
};

export default LessonLearnPage;

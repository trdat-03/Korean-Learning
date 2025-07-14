import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { TeacherSidebar } from '@/components/teacher/TeacherSidebar';
import { TeacherHeader } from '@/components/teacher/TeacherHeader';

export const TeacherLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Check if user is authenticated and has teacher role
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // TODO: Add role check if needed
  // if (currentUser?.role !== 'TEACHER') {
  //   return <Navigate to="/" replace />;
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherHeader />
      <div className="flex pt-16">
        <TeacherSidebar />
        <main className="flex-1 p-6 ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

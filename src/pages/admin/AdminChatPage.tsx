import React from 'react';
import AdminChatDashboard from '../../components/chat/AdminChatDashboard';
import { useUser } from '../../hooks/useUser';
import { Navigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';

const AdminChatPage: React.FC = () => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // Redirect if not admin
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  return (
    <AdminLayout title="Chat Support Management">
      <div className="h-full">
        <AdminChatDashboard adminId={user.id} />
      </div>
    </AdminLayout>
  );
};

export default AdminChatPage;

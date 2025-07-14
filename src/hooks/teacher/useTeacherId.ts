import { useAuth } from '@/hooks/useAuth';

/**
 * Hook to get the current teacher's ID
 * This hook ensures that only teachers can access teacher-specific features
 * and provides a consistent way to get the teacher ID across all teacher components
 */
export const useTeacherId = () => {
  const { currentUser, isAuthenticated } = useAuth();
  
  // Check if user is authenticated and has teacher role
  const isTeacher = isAuthenticated && currentUser?.role === 'TEACHER';
  const teacherId = isTeacher ? currentUser.id : null;
  
  return {
    teacherId,
    isTeacher,
    isAuthenticated,
    currentUser
  };
};

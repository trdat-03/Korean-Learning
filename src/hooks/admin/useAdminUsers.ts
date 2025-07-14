import { useState, useEffect, useCallback } from 'react';
import { adminUserService } from '@/services/admin/userService';
import type { UserDTO } from '@/models/User';

interface UseAdminUsersOptions {
  autoLoad?: boolean;
}

export const useAdminUsers = (options: UseAdminUsersOptions = {}) => {
  const { autoLoad = true } = options;
  
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await adminUserService.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData: Parameters<typeof adminUserService.createUser>[0]) => {
    try {
      setLoading(true);
      setError(null);
      const newUser = await adminUserService.createUser(userData);
      await fetchUsers(); // Refresh the list
      return newUser;
    } catch (err) {
      console.error('Error creating user:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Lỗi khi tạo người dùng: ${errorMessage}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  const updateUser = useCallback(async (userId: number, userData: Partial<UserDTO>) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedUser = await adminUserService.updateUser(userId, userData);
      
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? updatedUser : user
        )
      );
      
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (userId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminUserService.deleteUser(userId);
      
      if (response.success) {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      }
      
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    await fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (autoLoad) {
      fetchUsers();
    }
  }, [fetchUsers, autoLoad]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    refreshData
  };
};

export default useAdminUsers;

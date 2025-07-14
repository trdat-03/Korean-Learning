import { useState, useEffect } from 'react';
import { AuthService } from '@/utils/AuthService';
import type { UserDTO } from '@/models/User';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isLoggedIn());
  const [currentUser, setCurrentUser] = useState<UserDTO | null>(AuthService.getUser());

  useEffect(() => {
    const checkAuthStatus = () => {
      const authStatus = AuthService.isLoggedIn();
      const user = AuthService.getUser();
      setIsAuthenticated(authStatus);
      setCurrentUser(user);
    };

    checkAuthStatus();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return { isAuthenticated, currentUser };
};

import { ROUTES } from '@/constant/route';

// Helper functions to generate admin user routes
export const adminUserRoutes = {
  list: () => ROUTES.ADMIN.STUDENTS.LIST,
  create: () => ROUTES.ADMIN.USERS.CREATE,
  detail: (id: string | number) => ROUTES.ADMIN.USERS.DETAIL.replace(':id', String(id)),
  edit: (id: string | number) => ROUTES.ADMIN.USERS.EDIT.replace(':id', String(id)),
};

// Helper function to generate route params
export const generateAdminUserRoutes = {
  detail: (userId: string | number) => `/admin/users/${userId}`,
  edit: (userId: string | number) => `/admin/users/${userId}/edit`,
  create: '/admin/users/new',
  list: '/admin/students'
};

export default adminUserRoutes;

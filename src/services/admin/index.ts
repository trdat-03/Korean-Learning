
export * from './userService';
export * from './adminTransactionService';

export { adminCourseService } from './adminCourseService';
export type { 
  AdminCourseDTO, 
  AdminCourseData as BackendCourseData 
} from './adminCourseService';

export { adminCourseService as legacyCourseService } from './courseService';
export type { 
  AdminCourseData as LegacyCourseData 
} from './courseService';

export * from './categoryService';
export * from './lessonService';
export * from './dashboardService';

export type { AdminTransactionDTO, AdminTransactionStats } from './adminTransactionService';

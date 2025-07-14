# Admin Hooks & Services Documentation

This document describes the admin hooks and services created for the Korean Learning FE application.

## Overview

The admin system provides comprehensive hooks and services for managing:
- **Students** - User management and enrollment
- **Courses** - Course creation, editing, and management
- **Categories** - Course categorization
- **Lessons** - Lesson content and structure
- **Dashboard** - Analytics and system overview
- **Subscriptions** - Payment and subscription management

## Admin Services

### 1. Student Service (`adminStudentService`)
Located: `src/services/admin/studentService.ts`

**Key Features:**
- Get students with filtering and search
- Create, update, delete students
- Manage student status (active/inactive/suspended)
- Student course enrollment/unenrollment
- Student statistics and analytics
- Export student data

**Example Usage:**
```typescript
import { adminStudentService } from '@/services/admin/studentService';

// Get all students
const students = await adminStudentService.getStudents();

// Create student
const newStudent = await adminStudentService.createStudent({
  fullName: 'John Doe',
  email: 'john@example.com',
  phone: '0123456789',
  role: 'student',
  status: 'active'
});
```

### 2. Course Service (`adminCourseService`)
Located: `src/services/admin/courseService.ts`

**Key Features:**
- CRUD operations for courses
- Course statistics and analytics
- Student management per course
- Lesson management per course
- Course categories and filtering

### 3. Category Service (`adminCategoryService`)
Located: `src/services/admin/categoryService.ts`

**Key Features:**
- Category management
- Course assignment to categories
- Category statistics
- Search and filtering

### 4. Lesson Service (`adminLessonService`)
Located: `src/services/admin/lessonService.ts`

**Key Features:**
- Lesson CRUD operations
- Lesson content management
- Student progress tracking
- Lesson analytics and statistics
- File attachments

### 5. Dashboard Service (`adminDashboardService`)
Located: `src/services/admin/dashboardService.ts`

**Key Features:**
- System statistics
- Recent activities
- User growth analytics
- Revenue tracking
- System health monitoring

## Admin Hooks

### 1. useAdminStudents
Located: `src/hooks/admin/useAdminStudents.ts`

**Features:**
- Student list management
- Search and filtering
- Status updates
- Course enrollment management
- Real-time updates

**Usage:**
```typescript
import { useAdminStudents } from '@/hooks/admin/useAdminStudents';

const StudentsComponent = () => {
  const {
    students,
    loading,
    error,
    searchStudents,
    updateStudentStatus,
    deleteStudent,
    clearError,
  } = useAdminStudents();

  // Component logic here
};
```

### 2. useAdminCourses
Located: `src/hooks/admin/useAdminCourses.ts`

**Features:**
- Course management
- Statistics and analytics
- Student enrollment
- Lesson management
- Search and filtering

### 3. useAdminCategories
Located: `src/hooks/admin/useAdminCategories.ts`

**Features:**
- Category CRUD operations
- Course assignment
- Statistics tracking
- Search functionality

### 4. useAdminLessons
Located: `src/hooks/admin/useAdminLessons.ts`

**Features:**
- Lesson management
- Content editing
- Student progress tracking
- Analytics and reporting

### 5. useAdminDashboard
Located: `src/hooks/admin/useAdminDashboard.ts`

**Features:**
- Dashboard statistics
- Real-time updates
- System health monitoring
- Analytics data

**Usage:**
```typescript
import { useAdminDashboard } from '@/hooks/admin/useAdminDashboard';

const DashboardComponent = () => {
  const {
    stats,
    activities,
    topCourses,
    loading,
    refreshDashboard,
  } = useAdminDashboard();

  // Component logic here
};
```

### 6. useAdminSubscription
Located: `src/hooks/admin/useAdminSubscription.ts`

**Features:**
- Transaction management
- Payment approval/rejection
- Subscription statistics
- Date range filtering

## Integration Examples

### 1. Student Management Page
```typescript
import { useAdminStudents } from '@/hooks/admin/useAdminStudents';

export const AdminStudents = () => {
  const {
    students,
    loading,
    error,
    updateStudentStatus,
    deleteStudent,
  } = useAdminStudents();

  const handleStatusChange = async (studentId: number, status: 'active' | 'inactive') => {
    try {
      await updateStudentStatus(studentId, status);
    } catch (error) {
      console.error('Failed to update student status:', error);
    }
  };

  // Rest of component
};
```

### 2. Course Management Page
```typescript
import { useAdminCourses } from '@/hooks/admin/useAdminCourses';

export const AdminCourses = () => {
  const {
    courses,
    stats,
    loading,
    createCourse,
    updateCourse,
    deleteCourse,
  } = useAdminCourses();

  // Course management logic
};
```

### 3. Dashboard Page
```typescript
import { useAdminDashboard } from '@/hooks/admin/useAdminDashboard';

export const AdminDashboard = () => {
  const {
    stats,
    activities,
    topCourses,
    topStudents,
    loading,
    refreshDashboard,
  } = useAdminDashboard();

  // Dashboard display logic
};
```

## Error Handling

All hooks include comprehensive error handling:

```typescript
const { error, clearError } = useAdminStudents();

if (error) {
  return (
    <div className="error-container">
      <p>{error}</p>
      <Button onClick={clearError}>Try Again</Button>
    </div>
  );
}
```

## Loading States

All hooks provide loading states:

```typescript
const { loading } = useAdminStudents();

if (loading) {
  return <LoadingSpinner />;
}
```

## Real-time Updates

Some hooks support real-time updates:

```typescript
import { useAdminDashboardRealTime } from '@/hooks/admin/useAdminDashboard';

const {
  stats,
  isRealTimeEnabled,
  enableRealTime,
  disableRealTime,
} = useAdminDashboardRealTime();
```

## Best Practices

1. **Always handle errors** - Check for error states and provide user feedback
2. **Use loading states** - Show loading indicators during data fetching
3. **Implement optimistic updates** - Update UI immediately, then sync with server
4. **Cache data when appropriate** - Use the `autoLoad` option to control data fetching
5. **Clean up resources** - Hooks automatically clean up, but be mindful of memory leaks

## File Structure

```
src/
├── hooks/
│   └── admin/
│       ├── index.ts
│       ├── useAdminStudents.ts
│       ├── useAdminCourses.ts
│       ├── useAdminCategories.ts
│       ├── useAdminLessons.ts
│       ├── useAdminDashboard.ts
│       └── useAdminSubscription.ts
└── services/
    └── admin/
        ├── index.ts
        ├── studentService.ts
        ├── courseService.ts
        ├── categoryService.ts
        ├── lessonService.ts
        └── dashboardService.ts
```

## Contributing

When adding new admin functionality:

1. Create the service first in `src/services/admin/`
2. Add TypeScript interfaces for all data types
3. Create corresponding hooks in `src/hooks/admin/`
4. Update the index files to export new hooks/services
5. Add comprehensive error handling and loading states
6. Write unit tests for critical functionality
7. Update this documentation

## Notes

- All services use the centralized `api` instance for consistency
- TypeScript interfaces ensure type safety across the application
- Hooks follow React best practices with proper dependency arrays
- Error messages are in Vietnamese to match the application's locale
- All hooks support auto-loading data on mount (configurable)

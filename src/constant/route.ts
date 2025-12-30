export const ROUTES = {
  // Auth Routes
  LOGIN: "/login",
  REGISTER: "/register",
  ACCOUNT_VERIFICATION: "/account-verification",
  FORGOT_PASSWORD: "/forgot-password",
  VERIFY_RESET_CODE: "/verify-reset-code",
  RESET_PASSWORD: "/reset-password",

  // Public Routes
  HOME: "/",
  COURSES: "/courses",
  COURSE_DETAIL: "/courses/:id",
  COURSE_LEARN: "/courses/:id/learn",
  QUIZ_ATTEMPT: "/quiz/:quizId/attempt",
  QUIZ_RESULT: "/quiz/:quizId/result",
  CERTIFICATES: "/certificates",
  PRACTICE: "/practice/:lessonId",
  VOCABULARY_MATCHING: "/matching/:lessonId",
  
  FLASHCARD: {
    LIST: "/flashcards",
    DETAIL: "/flashcards/:id",
    CREATE: "/flashcards/create",
    EDIT: "/flashcards/edit/:id"
  },

  // Chat Routes
  CHAT: "/chat/:topicId?",
  CHAT_TOPICS: "/chat-topics",

  // Subscription Routes
  SUBSCRIPTION: {
    PLANS: "/subscription",
    STATUS: "/subscription/status"
  },

  // Admin Routes
  ADMIN: {
    DASHBOARD: "/admin",
    SUBSCRIPTION: "/admin/subscription",
    COURSES: {
      LIST: "/admin/courses",
      DETAIL: "/admin/courses/:id",
      CREATE: "/admin/courses/create",
      EDIT: "/admin/courses/edit/:id"
    },
    STUDENTS: {
      LIST: "/admin/students",
      DETAIL: "/admin/students/:id"
    },
    USERS: {
      LIST: "/admin/users",
      DETAIL: "/admin/users/:id",
      CREATE: "/admin/users/new",
      EDIT: "/admin/users/:id/edit"
    },
    CATEGORIES: {
      LIST: "/admin/categories",
      DETAIL: "/admin/categories/:id",
      CREATE: "/admin/categories/new",
      EDIT: "/admin/categories/edit/:id"
    },
    LESSONS: {
      DETAIL: "/admin/lessons/:id"
    }
  },

  // Teacher Routes
  TEACHER: {
    COURSES: {
      LIST: "/teacher/courses",
      DETAIL: "/teacher/courses/:id",
      CREATE: "/teacher/courses/create",
      EDIT: "/teacher/courses/edit/:id"
    },
    LESSONS: {
      DETAIL: "/teacher/lessons/:id"
    },
    STUDENTS: {
      LIST: "/teacher/students",
      DETAIL: "/teacher/students/:id"
    }
  },

  // Catch-all Route
  NOT_FOUND: "*"
};

// Utility route arrays
export const authRoutes = [ROUTES.LOGIN, ROUTES.REGISTER];
export const commonRoutes = [ROUTES.HOME, ROUTES.COURSE_DETAIL, ROUTES.COURSES];

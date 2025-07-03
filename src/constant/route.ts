export const ROUTES = {
  // Auth Routes
  LOGIN: "/login",
  REGISTER: "/register",

  // Public Routes
  HOME: "/",
  COURSES: "/courses",
  COURSE_DETAIL: "/courses/:id",
  COURSE_LEARN: "/courses/:id/learn",
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

  // Catch-all Route
  NOT_FOUND: "*"
};

// Utility route arrays
export const authRoutes = [ROUTES.LOGIN, ROUTES.REGISTER];
export const commonRoutes = [ROUTES.HOME, ROUTES.COURSE_DETAIL, ROUTES.COURSES];

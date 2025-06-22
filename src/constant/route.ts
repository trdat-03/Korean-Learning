export const Route = {
  //auth pages:
  LOGIN: "/login",
  REGISTER: "/register",
  // User Pages
  HOME: "/",
  COURSES: "/courses",
  PROFILE: "/profile",

  // Course Related Routes
  COURSE_DETAIL: "/course/:id",
  COURSE_LEARNING: "/course/:id/learning",
  VIDEO_TUTORIALS: "/course/:id/learning/tutorials",
  LIVESTREAM_VIDEOS: "/course/:id/learning/livestreams",
  LIVESTREAM_DETAIL: "/course/:id/learning/livestreams/:streamId",
  COURSE_MATERIALS: "/course/:id/learning/materials",
  VOCABULARY_MATERIAL: "/course/:id/learning/materials/vocabulary",
  EXAM_PAPERS: "/course/:id/learning/exams",
  EXAM_DETAIL: "/course/:id/learning/exams/:year/:session",
  EXAM_VOCABULARY: "/course/:id/learning/exams/:year/:session/vocabulary",
  EXAM_GRAMMAR: "/course/:id/learning/exams/:year/:session/grammar",
  EXAM_READING: "/course/:id/learning/exams/:year/:session/reading",
  EXAM_LISTENING: "/course/:id/learning/exams/:year/:session/listening",
  ROADMAP: "/course/:id/learning/roadmap",
  DAY_DETAIL: "/course/:id/learning/roadmap/day/:dayNumber",
  VOCABULARY_LEARNING: "/course/:id/learning/roadmap/day/:dayNumber/vocabulary",
  GRAMMAR_LEARNING: "/course/:id/learning/roadmap/day/:dayNumber/grammar",
  READING_LEARNING: "/course/:id/learning/roadmap/day/:dayNumber/reading",
  LISTENING_LEARNING: "/course/:id/learning/roadmap/day/:dayNumber/listening",
  VOCABULARY_VIDEO:
    "/course/:id/learning/roadmap/day/:dayNumber/vocabulary/video",
  GRAMMAR_VIDEO: "/course/:id/learning/roadmap/day/:dayNumber/grammar/video",
  READING_VIDEO: "/course/:id/learning/roadmap/day/:dayNumber/reading/video",
  LISTENING_VIDEO:
    "/course/:id/learning/roadmap/day/:dayNumber/listening/video",

  // Admin Routes
  ADMIN_DASHBOARD: "/admin",
  ADMIN_COURSES: "/admin/courses",
  ADMIN_COURSE_NEW: "/admin/courses/new",
  ADMIN_COURSE_EDIT: "/admin/courses/edit/:id",
  ADMIN_COURSE_DETAIL: "/admin/courses/:id",
  ADMIN_VIDEO_NEW: "/admin/courses/:courseId/videos/new",
  ADMIN_VIDEO_EDIT: "/admin/courses/:courseId/videos/edit/:videoId",
  ADMIN_LIVESTREAM_NEW: "/admin/courses/:courseId/livestreams/new",
  ADMIN_DOCUMENT_LIVESTREAM_NEW: "/admin/courses/:courseId/docs/new/:streamId",
  ADMIN_LIVESTREAM_EDIT: "/admin/courses/:courseId/livestreams/edit/:streamId",
  ADMIN_DOCUMENT_LIVESTREAM_EDIT:
    "/admin/courses/:courseId/docs/edit/:streamId",
  ADMIN_MATERIAL_NEW: "/admin/courses/:courseId/materials/new",
  ADMIN_MATERIAL_EDIT: "/admin/courses/:courseId/materials/edit/:materialId",
  ADMIN_MATERIAL_UPLOAD: "/admin/courses/:courseId/materials/upload",
  ADMIN_MATERIAL_UPLOAD_EDIT: "/admin/courses/:courseId/materials/upload/:materialId",
  ADMIN_EXAM_NEW: "/admin/courses/:courseId/sessions/:sessionId/exams/new",
  ADMIN_SESSION_NEW: "/admin/courses/:courseId/sessions/new",
  ADMIN_SESSION_EDIT: "admin/courses/:courseId/sessions/edit/:sessionId",
  ADMIN_EXAM_QUESTION:
    "/admin/courses/:courseId/exams/:examId/questions/:subject",
  ADMIN_EXAM_QUESTION_MANAGE:
    "/admin/courses/:courseId/exams/:examId/parts/:partIndex/manage",
  ADMIN_EXAM_EDIT:
    "/admin/courses/:courseId/sessions/:sessionId/exams/edit/:examId",
  ADMIN_ROADMAP_EDIT: "/admin/courses/:courseId/roadmap/edit",
  ADMIN_ROADMAP_DAY_DETAIL: "/admin/courses/:courseId/roadmap/day/:dayNumber",
  ADMIN_SUBJECT_MATERIAL_NEW:
    "/admin/courses/:courseId/roadmap/day/:dayNumber/:subject/new",
  ADMIN_SUBJECT_MATERIAL_EDIT:
    "/admin/courses/:courseId/roadmap/day/:dayNumber/:subject/edit/:materialId",
  ADMIN_STUDENTS: "/admin/students",
  ADMIN_CREATE_STUDENT: "/admin/students/new",
  ADMIN_STUDENT_DETAIL: "/admin/students/:studentId",
  ADMIN_ACTIVATION_CODES: "/admin/activation-codes",
  ADMIN_PAYMENT_SLIPS: "/admin/payment-slips",
  ADMIN_ASSIGNMENTS: "/admin/assignments",
  ADMIN_CATEGORY: "/admin/categories",
  ADMIN_CATEGORY_NEW: "/admin/categories/new",
  ADMIN_CATEGORY_EDIT: "/admin/categories/edit/:id",
  ADMIN_CATEGORY_DETAIL: "/admin/categories/:id",

  // Catch-all Route
  NOT_FOUND: "*",
};

export const CHAT_TOPICS = '/chat-topics';

export const authRoutes = [Route.LOGIN, Route.REGISTER];
export const commonRoutes = [Route.HOME, Route.COURSE_DETAIL, Route.COURSES];

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Authentication/Login";
import Register from "./pages/Authentication/Register";
import AccountVerificationPage from "./pages/Authentication/AccountVerificationPage";
import ForgotPasswordPage from "./pages/Authentication/ForgotPasswordPage";
import VerifyResetCodePage from "./pages/Authentication/VerifyResetCodePage";
import ResetPasswordPage from "./pages/Authentication/ResetPasswordPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { AdminCourses } from "./pages/admin/AdminCourses";
import Course from "./pages/CoursePage";
import { AdminStudents } from "./pages/admin/AdminStudents";
import { AdminCategories } from "./pages/admin/AdminCategories";
import AdminCourseDetail from "./pages/admin/AdminCourseDetail";
import AdminCourseForm from "./pages/admin/AdminCourseForm";
import { AdminStudentDetail } from "./pages/admin/AdminStudentDetail";
import AdminLessonDetail from "./pages/admin/AdminLessonDetail"; 
import LessonLearnPage from "./pages/LessonLearnPage";
import PracticePage from './pages/PracticePage';

import Index from "./pages/Index";
import VocabularyMatchingPage from './pages/VocabularyMatchingPage';
import { ConversationPage } from './pages/conversation/ConversationPage';
import { ChatTopicsPage } from './pages/conversation/ChatTopicsPage';
import { Toaster } from "./components/ui/toaster";
import {FlashcardPage} from './pages/flashcard/FlashcardPage';
import { FlashcardDetailPage } from "@/pages/flashcard/FlashcardDetailPage";
import { FlashcardEditPage } from "@/pages/flashcard/FlashcardEditPage";
import { FlashcardCreatePage } from "./pages/flashcard/FlashcardCreatePage";

// Quiz imports
import QuizAttemptPage from "./pages/quiz/QuizAttemptPage";
import QuizResultPage from "./pages/quiz/QuizResultPage";

// Certificate imports
import CertificatePage from "./pages/certificate/CertificatePage";

// Subscription imports
import SubscriptionPlansPage from "./pages/subscription/SubscriptionPlansPage";
import SubscriptionStatusPage from "./pages/subscription/SubscriptionStatusPage";
import AdminSubscriptionDashboard from "./pages/admin/AdminSubscriptionDashboard";
import AdminChatPage from "./pages/admin/AdminChatPage";

// Chat imports
import ChatButton from "./components/chat/ChatButton";
import { useUser } from "./hooks/authentication/useUser";

function App() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Các route authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account-verification" element={<AccountVerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-reset-code" element={<VerifyResetCodePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />


          {/* Public routes */}
          <Route path="/courses/:id" element={<Course />} />
          <Route path="/courses/:id/learn" element={<LessonLearnPage />} />
          <Route path="/practice/:lessonId" element={<PracticePage />} />
          <Route path="/matching/:lessonId" element={<VocabularyMatchingPage />} />


          {/* Các route admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/chat" element={<AdminChatPage />} />
          <Route path="/admin/subscription" element={<AdminSubscriptionDashboard />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/courses/:id" element={<AdminCourseDetail />} />
          <Route path="/admin/courses/create" element={<AdminCourseForm />} />
          <Route path="/admin/courses/edit/:id" element={<AdminCourseForm />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/students/:id" element={<AdminStudentDetail />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/lessons/:id" element={<AdminLessonDetail />} />

          {/* Subscription routes */}
          <Route path="/subscription" element={<SubscriptionPlansPage />} />
          <Route path="/subscription/status" element={<SubscriptionStatusPage />} />

          {/* Chat routes */}
          <Route path="/chat-topics" element={<ChatTopicsPage />} />
          <Route path="/conversation/:topicId?" element={<ConversationPage />} />
          
          {/* Quiz routes */}
          <Route path="/quiz/:quizId/attempt" element={<QuizAttemptPage />} />
          <Route path="/quiz/:quizId/result" element={<QuizResultPage />} />
          
          {/* Certificate routes */}
          <Route path="/certificates" element={<CertificatePage />} />
          
          {/* Flashcard routes */}
          <Route path="/flashcards" element={<FlashcardPage />} />
          <Route path="/flashcards/:id" element={<FlashcardDetailPage />} />
          <Route path="/flashcards/edit/:id" element={<FlashcardEditPage />} />
          <Route path="/flashcards/create" element={<FlashcardCreatePage />} />
          
          {/* Route mặc định */}
          <Route path="/" element={<Index />} />
          <Route path="*" element={<Index />} />
        </Routes>
        
        {/* Chat Button - Show on all pages except login/register */}
        {user && !window.location.pathname.includes('/login') && 
         !window.location.pathname.includes('/register') && 
         !window.location.pathname.includes('/account-verification') && 
         !window.location.pathname.includes('/forgot-password') && 
         !window.location.pathname.includes('/verify-reset-code') && 
         !window.location.pathname.includes('/reset-password') && (
          <ChatButton 
            userId={user.id} 
            userRole={user.role} 
          />
        )}
        
        <Toaster />
      </Router>
    </div>
  );
}

export default App;
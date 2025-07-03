import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Authentication/Login";
import Register from "./pages/Authentication/Register";
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
import { ChatPage } from './pages/chat/ChatPage';
import { ChatTopicsPage } from './pages/chat/ChatTopicsPage';
import { Toaster } from "./components/ui/toaster";
import {FlashcardPage} from './pages/flashcard/FlashcardPage';
import { FlashcardDetailPage } from "@/pages/flashcard/FlashcardDetailPage";
import { FlashcardEditPage } from "@/pages/flashcard/FlashcardEditPage";
import { FlashcardCreatePage } from "./pages/flashcard/FlashcardCreatePage";

// Subscription imports
import SubscriptionPlansPage from "./pages/subscription/SubscriptionPlansPage";
import SubscriptionStatusPage from "./pages/subscription/SubscriptionStatusPage";
import AdminSubscriptionDashboard from "./pages/admin/AdminSubscriptionDashboard";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Các route authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />


        {/* Public routes */}
          <Route path="/courses/:id" element={<Course />} />
          <Route path="/courses/:id/learn" element={<LessonLearnPage />} />
          <Route path="/practice/:lessonId" element={<PracticePage />} />
          <Route path="/matching/:lessonId" element={<VocabularyMatchingPage />} />


          {/* Các route admin */}
          <Route path="/admin" element={<AdminDashboard />} />
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
          <Route path="/chat/:topicId?" element={<ChatPage />} />
          
          {/* Flashcard routes */}
          <Route path="/flashcards" element={<FlashcardPage />} />
          <Route path="/flashcards/:id" element={<FlashcardDetailPage />} />
          <Route path="/flashcards/edit/:id" element={<FlashcardEditPage />} />
          <Route path="/flashcards/create" element={<FlashcardCreatePage />} />
          
          {/* Route mặc định */}
          <Route path="/" element={<Index />} />
          <Route path="*" element={<Index />} />
        </Routes>
        <Toaster />
      </Router>
    </div>
  );
}

export default App;
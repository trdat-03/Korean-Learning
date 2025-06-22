import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Authentication/Login";
import Register from "./pages/Authentication/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { AdminCourses } from "./pages/admin/AdminCourses";
import Course from "./pages/Course";
import { AdminStudents } from "./pages/admin/AdminStudents";
import { AdminCategories } from "./pages/admin/AdminCategories";
import AdminCourseDetail from "./pages/admin/AdminCourseDetail";
import AdminCourseForm from "./pages/admin/AdminCourseForm";
import { AdminStudentDetail } from "./pages/admin/AdminStudentDetail";
import AdminLessonDetail from "./pages/admin/AdminLessonDetail"; 
import LessonLearnPage from "./pages/LessonLearnPage";
import Practice from './pages/Practice';
import Index from "./pages/Index";
import VocabularyMatching from './pages/VocabularyMatching';
import ChatTopics from './pages/ChatTopics';
import Chat from './pages/Chat';

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
          <Route path="/practice/:lessonId" element={<Practice />} />
          <Route path="/matching/:lessonId" element={<VocabularyMatching />} />


          {/* Các route admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/courses/:id" element={<AdminCourseDetail />} />
          <Route path="/admin/courses/create" element={<AdminCourseForm />} />
          <Route path="/admin/courses/edit/:id" element={<AdminCourseForm />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/students/:id" element={<AdminStudentDetail />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/lessons/:id" element={<AdminLessonDetail />} />


          
          {/* Route mặc định */}
          <Route path="/" element={<Index />} />
          <Route path="*" element={<Index />} />

          <Route path="/chat-topics" element={<ChatTopics />} />
          <Route path="/chat/:topicId" element={<Chat />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
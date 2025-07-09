import React from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { EnrollDialog } from "@/components/EnrollDialog";
import { LoginPromptDialog } from "@/components/LoginPromptDialog";
import { CourseContent } from "@/components/features/course/CourseContent";
import { CourseEnrollCard } from "@/components/features/course/CourseEnrollCard";
import { QuizSection } from "@/components/features/quiz/QuizSection";
import { useCourse } from "@/hooks/features/course/useCourse";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Course: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    course,
    loading,
    isEnrolled,
    showDialog,
    showLoginPrompt,
    setShowDialog,
    setShowLoginPrompt,
    handleEnrollment,
    handleCourseAction,
  } = useCourse(Number(id));

  if (loading) return <p className="text-center py-10">Đang tải dữ liệu...</p>;
  if (!course) return <p className="text-center py-10">Không tìm thấy khóa học.</p>;

  return (
    <>
      <Header />
      <ToastContainer position="top-center" />
      <EnrollDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={handleEnrollment}
      />
      <LoginPromptDialog
        open={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        onLogin={() => setShowLoginPrompt(false)}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold mb-4">{course.title}</h1>
            <p className="text-gray-700 mb-6">{course.description}</p>
            <CourseContent course={course} />
            
            {/* Quiz Section */}
            <div className="mt-8">
              <QuizSection
                courseId={course.id}
                courseTitle={course.title}
              />
            </div>
          </div>

          <div className="w-full lg:w-[350px] flex-shrink-0">
            <CourseEnrollCard
              course={course}
              isEnrolled={isEnrolled}
              onAction={handleCourseAction}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Course;

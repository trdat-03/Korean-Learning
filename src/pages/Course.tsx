import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { CourseDetail } from "@/models/CourseDetail";
import { Header } from "@/components/Header";
import { AuthService } from "@/utils/AuthService";
import { EnrollDialog } from "@/components/EnrollDialog";
import { LoginPromptDialog } from "@/components/LoginPromptDialog";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Course: React.FC = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const navigate = useNavigate();

  const quickInfo = [
    { icon: "📚", label: "Tổng số bài học" },
    { icon: "⏰", label: "Học theo tốc độ của bạn" },
    { icon: "🌍", label: "Học mọi lúc, mọi nơi" },
  ];

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/courses/${id}`);
        const data: CourseDetail = await res.json();
        setCourse(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu khóa học:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  useEffect(() => {
    const checkEnrollment = async () => {
      const user = AuthService.getUser();
      if (!user || !course?.id) return;

      try {
        const res = await fetch(
          `http://localhost:8080/api/enrollments/check?userId=${user.id}&courseId=${course.id}`
        );
        const data = await res.json();
        setIsEnrolled(data === true);
      } catch (err) {
        console.error("Lỗi khi kiểm tra đăng ký:", err);
      }
    };

    if (course) {
      checkEnrollment();
    }
  }, [course]);

  const handleConfirmEnroll = async () => {
    const user = AuthService.getUser();
    if (!user || !course) return;

    try {
      const res = await fetch("http://localhost:8080/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          courseId: course.id,
        }),
      });

      if (res.ok) {
        toast.success("Đăng ký khóa học thành công!");
        setIsEnrolled(true);
        setShowDialog(false);
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Đăng ký khóa học thất bại!");
    }
  };

  if (loading) return <p className="text-center py-10">Đang tải dữ liệu...</p>;
  if (!course) return <p className="text-center py-10">Không tìm thấy khóa học.</p>;

  return (
    <>
      <Header />
      <ToastContainer position="top-center" />
      <EnrollDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={handleConfirmEnroll}
      />
      <LoginPromptDialog
        open={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        onLogin={() => {
          setShowLoginPrompt(false);
          navigate("/login");
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold mb-4">{course.title}</h1>
            <p className="text-gray-700 mb-6">{course.description}</p>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold">Nội dung khóa học</h2>
              </div>
              <div className="text-gray-600 mb-4 text-sm">
                {course.lessons.length} bài học • Giảng viên: {course.teacherName}
              </div>
              <div className="space-y-3">
                {course.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between bg-gray-100 rounded px-4 py-3 font-medium text-base hover:bg-gray-200 transition cursor-pointer"
                  >
                    <span>
                      <span className="text-red-500 mr-2">+</span>
                      {lesson.title}
                    </span>
                    <span className="text-gray-600 text-sm">
                      {lesson.vocabularyCount} từ vựng, {lesson.grammarCount} ngữ pháp
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[350px] flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-4 mb-4">
              <div className="w-full mb-4 flex justify-center">
                <img
                  src={`/images/${course.image}`}
                  alt="Course Banner"
                  className="rounded-lg max-w-full h-auto object-contain bg-red-50 border border-red-100"
                  style={{ maxHeight: 220 }}
                />
              </div>
              <div className="text-center mb-2">
                <span className="text-3xl font-bold text-red-600">Miễn phí</span>
              </div>
              <button
                className={`w-full ${
                  isEnrolled ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                } text-white font-bold py-2 rounded mb-4 transition`}
                onClick={() => {
                  if (!AuthService.isLoggedIn()) {
                    setShowLoginPrompt(true);
                  } else {
                    isEnrolled ? navigate(`/courses/${course.id}/learn`) : setShowDialog(true);
                  }
                }}
              >
                {isEnrolled ? "TIẾP TỤC HỌC TẬP" : "ĐĂNG KÝ HỌC"}
              </button>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-red-600">⭐</span>
                  <span>Trình độ cơ bản</span>
                </div>
                {quickInfo.map((info, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span>{info.icon}</span>
                    <span>{info.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Course;

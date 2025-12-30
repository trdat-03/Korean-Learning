import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CreateLessonDialog } from "@/components/admin/CreateLessonDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Video,
  Play,
  BookOpen,
  FileText,
  Calendar,
  Edit,
  Users,
  Loader2,
} from "lucide-react";
import { adminCourseService } from "@/services/admin/courseService";
import type { CourseDetail } from "@/models/CourseDetail";
import type { LessonDetailDTO } from "@/services/admin/lessonService";


export default function AdminCourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourseDetail = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await adminCourseService.getCourseDetailPublic(Number(id));
      setCourse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch course detail');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refresh = useCallback(() => {
    fetchCourseDetail();
  }, [fetchCourseDetail]);

  // Xử lý khi tạo bài học thành công
  const handleLessonCreated = (newLesson: LessonDetailDTO) => {
    // Refresh lại dữ liệu course để cập nhật danh sách bài học
    fetchCourseDetail();
  };

  useEffect(() => {
    if (id) {
      fetchCourseDetail();
    }
  }, [id, fetchCourseDetail]);

  // Dữ liệu cứng cho các phần không có trong API
  const rating = 4.8;
  const price = "1.200.000đ";
  const original_price = "1.500.000đ";
  const video = [
    {
      _id: "1",
      thumbnail_url: "https://placehold.co/80x60",
      title: "Giới thiệu bảng chữ cái",
      duration: 15,
    },
    {
      _id: "2",
      thumbnail_url: "https://placehold.co/80x60",
      title: "Phát âm cơ bản",
      duration: 20,
    },
  ];
  const livestream = [
    {
      _id: "1",
      thumbnail_url: "https://placehold.co/80x60",
      title: "Livestream khai giảng",
      created_at: "2024-06-01T00:00:00Z",
      duration_minutes: 60,
    },
  ];
  const textbook = [
    {
      _id: "1",
      title: "Giáo trình tiếng Hàn sơ cấp 1",
    },
    {
      _id: "2",
      title: "Giáo trình tiếng Hàn sơ cấp 2",
    },
  ];

  if (loading) {
    return (
      <AdminLayout title="Đang tải...">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Đang tải chi tiết khóa học...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Lỗi">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => { clearError(); refresh(); }} variant="outline">
              Thử lại
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!course) {
    return (
      <AdminLayout title="Không tìm thấy">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Không tìm thấy khóa học</p>
            <Link to="/admin/courses">
              <Button variant="outline">Quay lại danh sách</Button>
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const stats = [
    {
      label: "Học sinh đăng ký",
      value: course.studentCount?.toLocaleString() ?? "0",
      icon: Users,
    },
    {
      label: "Video hướng dẫn",
      value: video.length.toLocaleString(),
      icon: Video,
    },
    {
      label: "Buổi livestream",
      value: livestream.length.toLocaleString(),
      icon: Play,
    },
    { label: "Tài liệu", value: textbook.length.toString(), icon: BookOpen },
    { label: "Đề thi", value: "8", icon: FileText },
    { label: "Ngày học", value: "120", icon: Calendar },
  ];

  return (
    <AdminLayout title={`Quản lý: ${course.title}`}>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <Link to="/admin/courses">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách
            </Button>
          </Link>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Link to="#" className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa thông tin
              </Button>
            </Link>
          </div>
        </div>

        {/* Course Info */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <img
                src="https://placehold.co/200x150"
                alt={course.title}
                className="w-full sm:w-32 h-48 sm:h-32 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">
                  {course.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
                  <Badge variant="outline">{course.categoryName || "Sơ cấp"}</Badge>
                  <span className="text-sm text-gray-600">
                    3 tháng
                  </span>
                  <span className="text-sm text-gray-600">
                    Giảng viên: {course.teacherName}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 text-sm sm:text-base whitespace-pre-line break-words">
                  {course.description}
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <span className="text-lg font-semibold text-green-600">
                    {price}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {original_price}
                  </span>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1">{rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-3 sm:p-4 text-center">
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-lg sm:text-2xl font-bold">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Content Management Tabs */}
        <Tabs defaultValue="lessons" className="space-y-4 sm:space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-5 min-w-max">
              <TabsTrigger value="lessons" className="text-xs sm:text-sm">
                Danh sách bài học
              </TabsTrigger>
              <TabsTrigger value="livestreams" className="text-xs sm:text-sm">
                Livestream
              </TabsTrigger>
              <TabsTrigger value="materials" className="text-xs sm:text-sm">
                Tài liệu
              </TabsTrigger>
              <TabsTrigger value="exams" className="text-xs sm:text-sm">
                Đề thi
              </TabsTrigger>
              <TabsTrigger value="roadmap" className="text-xs sm:text-sm">
                Lộ trình 120 ngày
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="lessons">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Danh sách bài học</CardTitle>
                  <CreateLessonDialog
                    courseId={course.id}
                    courseName={course.title}
                    onLessonCreated={handleLessonCreated}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {course.lessons && course.lessons.length > 0 ? (
                    course.lessons.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/admin/lessons/${lesson.id}`)}
                      >
                        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                          <div className="w-12 h-9 sm:w-16 sm:h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                            <span className="font-bold text-lg">{index + 1}</span>
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-medium text-sm sm:text-base truncate">
                              {lesson.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600">
                              Thứ tự: {lesson.orderNumber} • Từ vựng: {lesson.vocabularyCount} • Ngữ pháp: {lesson.grammarCount}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p className="mb-4">Chưa có bài học nào.</p>
                      <CreateLessonDialog
                        courseId={course.id}
                        courseName={course.title}
                        onLessonCreated={handleLessonCreated}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="livestreams">
            <Card>
              {/* Để trống */}
            </Card>
          </TabsContent>

          <TabsContent value="materials">
            <Card>
              {/* Để trống */}
            </Card>
          </TabsContent>

          <TabsContent value="exams">
            <Card>
              {/* Để trống */}
            </Card>
          </TabsContent>

          <TabsContent value="roadmap">
            <Card>
              {/* Để trống */}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
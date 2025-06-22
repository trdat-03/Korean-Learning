import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Clock, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useGetAllUserCourses } from "@/pages/hooks/useGetAllUserCourse";

export const CoursesSection = () => {
  const [limit, setLimit] = useState(6);
  const { data: courses } = useGetAllUserCourses({
    q: "",
    page: 1,
    limit: limit,
  });
  return (
    <section id="courses" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            📚 Khóa học tiếng Nhật
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Chọn khóa học phù hợp với bạn
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Từ cơ bản đến nâng cao, chúng tôi có đầy đủ các khóa học để giúp bạn
            thành thạo tiếng Nhật
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses?.results?.map((course) => (
            <Card
              key={course?.id}
              className="group hover:shadow-xl transition-all duration-300 border-red-100 hover:border-red-200"
            >
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={course?.image_url}
                    alt={course?.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {course.badge && (
                    <Badge className="absolute top-4 left-4 bg-red-600 hover:bg-red-700">
                      {course?.badge}
                    </Badge>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-900">
                    {course?.level}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                    {course?.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {course?.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{course?.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{course?.total_students.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{course?.rating}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-600 font-medium">
                    Giảng viên: {course?.instructor_id?.name}
                  </p>
                  <div className="space-y-1">
                    {course.features.slice(0, 2).map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 text-sm text-gray-600"
                      >
                        <BookOpen className="w-3 h-3 text-red-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-red-600">
                          {course?.price}
                        </span>
                        {course?.original_price && (
                          <span className="text-sm text-gray-500 line-through">
                            {course?.original_price}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Link to={`/course/${course?.id}`}>
                      <Button
                        variant="outline"
                        className="w-full border-red-200 hover:bg-red-50"
                      >
                        Xem chi tiết
                      </Button>
                    </Link>
                    <Button className="w-full bg-red-600 hover:bg-red-700 group-hover:bg-red-700 transition-colors">
                      Đăng ký ngay
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {courses?.totalResults > limit && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="border-red-200 hover:bg-red-50"
              onClick={() => setLimit(courses?.totalResults)}
            >
              Xem tất cả khóa học
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

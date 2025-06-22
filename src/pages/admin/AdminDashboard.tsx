import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, ClipboardList, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const statsData = [
    {
      title: "Tổng khóa học",
      value: "12",
      icon: BookOpen,
      change: "+2 tuần này",
      changeType: "positive" as const
    },
    {
      title: "Học sinh đăng ký",
      value: "1,247",
      icon: Users,
      change: "+18% tháng này",
      changeType: "positive" as const
    },
    {
      title: "Bài tập chờ chấm",
      value: "34",
      icon: ClipboardList,
      change: "Cần xử lý",
      changeType: "warning" as const
    },
    {
      title: "Doanh thu tháng",
      value: "245M VNĐ",
      icon: TrendingUp,
      change: "+12% so với tháng trước",
      changeType: "positive" as const
    }
  ];

  const activities = [
    {
      id: "1",
      type: "success",
      message: "Nguyễn Văn A hoàn thành khóa N3",
      timestamp: "2 phút trước"
    },
    {
      id: "2",
      type: "info",
      message: "Khóa học Business Japanese được tạo",
      timestamp: "1 giờ trước"
    },
    {
      id: "3",
      type: "warning",
      message: "15 bài tập N2 sắp hết hạn",
      timestamp: "3 giờ trước"
    }
  ];

  const popularCourses = [
    {
      id: "1",
      name: "N5 Hiragana & Katakana",
      studentCount: 2847
    },
    {
      id: "2",
      name: "Giao tiếp hàng ngày",
      studentCount: 3241
    },
    {
      id: "3",
      name: "Luyện thi JLPT N2",
      studentCount: 1678
    },
    {
      id: "4",
      name: "Kanji Master",
      studentCount: 2156
    }
  ];

  return (
    <AdminLayout title="Tổng quan hệ thống">
      <div className="space-y-4 sm:space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <Icon className="w-4 h-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                  <p className={`text-xs ${
                    stat.changeType === 'positive' ? 'text-green-600' :
                    stat.changeType === 'warning' ? 'text-orange-600' :
                    'text-gray-600'
                  }`}>
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.type === 'success' ? 'bg-green-500' :
                      activity.type === 'info' ? 'bg-blue-500' :
                      'bg-orange-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Khóa học phổ biến</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularCourses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate pr-2">{course.name}</span>
                    <span className="text-sm text-gray-500 flex-shrink-0">
                      {course.studentCount.toLocaleString()} học sinh
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
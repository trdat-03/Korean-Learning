import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  // AlertTriangle,
  // CheckCircle,
  User
} from "lucide-react";

interface StudentDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  lastActivity: string;
  avatar?: string;
  status: "active" | "inactive" | "completed";
}

interface CourseEnrollment {
  courseId: string;
  courseName: string;
  enrollDate: string;
  progress: number;
  status: "active" | "completed" | "expired";
  accessCode?: string;
  expiryDate?: string;
  price: number;
  paidAmount: number;
  debtAmount: number;
}

interface Assignment {
  id: string;
  title: string;
  type: "vocabulary" | "grammar" | "reading" | "listening";
  dueDate: string;
  submittedDate?: string;
  status: "pending" | "submitted" | "overdue" | "graded";
  score?: number;
  courseName: string;
}

interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: "cash" | "transfer" | "card" | "access_code";
  status: "completed" | "pending" | "failed";
  courseId: string;
  courseName: string;
  note?: string;
}

export const AdminStudentDetail = () => {
  const navigate = useNavigate();

  // Mock student data
  const student: StudentDetail = {
    id: "1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0901234567",
    joinDate: "2024-01-15",
    lastActivity: "2 giờ trước",
    status: "active"
  };

  const enrollments: CourseEnrollment[] = [
    {
      courseId: "1",
      courseName: "N5 Hiragana & Katakana",
      enrollDate: "2024-01-15",
      progress: 75,
      status: "active",
      accessCode: "ABC123",
      expiryDate: "2024-07-15",
      price: 2000000,
      paidAmount: 1000000,
      debtAmount: 1000000
    },
    {
      courseId: "2", 
      courseName: "Giao tiếp hàng ngày",
      enrollDate: "2024-02-01",
      progress: 30,
      status: "active",
      price: 1500000,
      paidAmount: 1500000,
      debtAmount: 0
    }
  ];

  const assignments: Assignment[] = [
    {
      id: "1",
      title: "Bài tập từ vựng tuần 3",
      type: "vocabulary",
      dueDate: "2024-01-25",
      status: "pending",
      courseName: "N5 Hiragana & Katakana"
    },
    {
      id: "2",
      title: "Luyện tập ngữ pháp cơ bản",
      type: "grammar",
      dueDate: "2024-01-20",
      status: "overdue",
      courseName: "Giao tiếp hàng ngày"
    },
    {
      id: "3",
      title: "Đọc hiểu văn bản",
      type: "reading",
      dueDate: "2024-01-30",
      submittedDate: "2024-01-28",
      status: "submitted",
      courseName: "N5 Hiragana & Katakana"
    }
  ];

  const payments: PaymentRecord[] = [
    {
      id: "1",
      date: "2024-01-15",
      amount: 1000000,
      method: "transfer",
      status: "completed",
      courseId: "1",
      courseName: "N5 Hiragana & Katakana",
      note: "Thanh toán lần 1"
    },
    {
      id: "2",
      date: "2024-02-01",
      amount: 1500000,
      method: "cash",
      status: "completed",
      courseId: "2",
      courseName: "Giao tiếp hàng ngày"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Đang học</Badge>;
      case "inactive":
        return <Badge className="bg-red-100 text-red-800">Không hoạt động</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Hoàn thành</Badge>;
      case "expired":
        return <Badge className="bg-gray-100 text-gray-800">Hết hạn</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getAssignmentStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ nộp</Badge>;
      case "submitted":
        return <Badge className="bg-blue-100 text-blue-800">Đã nộp</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">Quá hạn</Badge>;
      case "graded":
        return <Badge className="bg-green-100 text-green-800">Đã chấm</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  // const getPaymentStatusBadge = (status: string) => {
  //   switch (status) {
  //     case "completed":
  //       return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>;
  //     case "pending":
  //       return <Badge className="bg-yellow-100 text-yellow-800">Chờ xử lý</Badge>;
  //     case "failed":
  //       return <Badge className="bg-red-100 text-red-800">Thất bại</Badge>;
  //     default:
  //       return <Badge variant="outline">Không xác định</Badge>;
  //   }
  // };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const totalDebt = enrollments.reduce((sum, enrollment) => sum + enrollment.debtAmount, 0);
  const totalPaid = payments.reduce((sum, payment) => payment.status === "completed" ? sum + payment.amount : sum, 0);

  return (
    <AdminLayout title={`Chi tiết học sinh: ${student.name}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate("/admin/students")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <Mail className="w-4 h-4 mr-2" />
              Gửi email
            </Button>
            <Button variant="outline">
              <Phone className="w-4 h-4 mr-2" />
              Gọi điện
            </Button>
          </div>
        </div>

        {/* Student Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Thông tin học sinh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500">Họ và tên</p>
                <p className="font-medium">{student.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{student.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="font-medium">{student.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày tham gia</p>
                <p className="font-medium">{new Date(student.joinDate).toLocaleDateString('vi-VN')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Hoạt động cuối</p>
                <p className="font-medium">{student.lastActivity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trạng thái</p>
                {getStatusBadge(student.status)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Tổng đã thanh toán</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{formatCurrency(totalPaid)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600">Tổng công nợ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">{formatCurrency(totalDebt)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Số khóa đang học</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">
                {enrollments.filter(e => e.status === "active").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="courses" className="w-full">
          <TabsList>
            <TabsTrigger value="courses">Khóa học</TabsTrigger>
            <TabsTrigger value="assignments">Bài tập</TabsTrigger>
            <TabsTrigger value="payments">Lịch sử thanh toán</TabsTrigger>
            <TabsTrigger value="debt">Quản lý công nợ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Khóa học đã đăng ký</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Khóa học</TableHead>
                      <TableHead>Ngày đăng ký</TableHead>
                      <TableHead>Tiến độ</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Mã truy cập</TableHead>
                      <TableHead>Hết hạn</TableHead>
                      <TableHead>Học phí</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrollments.map((enrollment) => (
                      <TableRow key={enrollment.courseId}>
                        <TableCell className="font-medium">{enrollment.courseName}</TableCell>
                        <TableCell>{new Date(enrollment.enrollDate).toLocaleDateString('vi-VN')}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{enrollment.progress}%</span>
                            </div>
                            <Progress value={enrollment.progress} className="w-20" />
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(enrollment.status)}</TableCell>
                        <TableCell>
                          {enrollment.accessCode && (
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                              {enrollment.accessCode}
                            </code>
                          )}
                        </TableCell>
                        <TableCell>
                          {enrollment.expiryDate && new Date(enrollment.expiryDate).toLocaleDateString('vi-VN')}
                        </TableCell>
                        <TableCell>{formatCurrency(enrollment.price)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments">
            <Card>
              <CardHeader>
                <CardTitle>Bài tập và deadline</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bài tập</TableHead>
                      <TableHead>Khóa học</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Hạn nộp</TableHead>
                      <TableHead>Ngày nộp</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Điểm</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">{assignment.title}</TableCell>
                        <TableCell>{assignment.courseName}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {assignment.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(assignment.dueDate).toLocaleDateString('vi-VN')}</TableCell>
                        <TableCell>
                          {assignment.submittedDate 
                            ? new Date(assignment.submittedDate).toLocaleDateString('vi-VN')
                            : "-"
                          }
                        </TableCell>
                        <TableCell>{getAssignmentStatusBadge(assignment.status)}</TableCell>
                        <TableCell>
                          {assignment.score ? `${assignment.score}/100` : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Lịch sử thanh toán</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ngày</TableHead>
                      <TableHead>Khóa học</TableHead>
                      <TableHead>Số tiền</TableHead>
                      <TableHead>Phương thức</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ghi chú</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{new Date(payment.date).toLocaleDateString('vi-VN')}</TableCell>
                        <TableCell>{payment.courseName}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {payment.method}
                          </Badge>
                        </TableCell>
                        <TableCell>{getPaymentStatusBadge(payment.status)}</TableCell>
                        <TableCell>{payment.note || "-"}</TableCell>
                      </TableRow>
                    ))} */}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="debt">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý công nợ</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Khóa học</TableHead>
                      <TableHead>Tổng học phí</TableHead>
                      <TableHead>Đã thanh toán</TableHead>
                      <TableHead>Còn nợ</TableHead>
                      <TableHead>Hạn đóng</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* {enrollments.map((enrollment) => (
                      <TableRow key={enrollment.courseId} className={enrollment.debtAmount > 0 ? "bg-red-50" : ""}>
                        <TableCell className="font-medium">{enrollment.courseName}</TableCell>
                        <TableCell>{formatCurrency(enrollment.price)}</TableCell>
                        <TableCell className="text-green-600 font-medium">
                          {formatCurrency(enrollment.paidAmount)}
                        </TableCell>
                        <TableCell className={`font-medium ${enrollment.debtAmount > 0 ? "text-red-600" : "text-green-600"}`}>
                          {formatCurrency(enrollment.debtAmount)}
                        </TableCell>
                        <TableCell>
                          {enrollment.expiryDate && new Date(enrollment.expiryDate).toLocaleDateString('vi-VN')}
                        </TableCell>
                        <TableCell>
                          {enrollment.debtAmount > 0 ? (
                            <Badge className="bg-red-100 text-red-800">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Còn nợ
                            </Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Hoàn thành
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))} */}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

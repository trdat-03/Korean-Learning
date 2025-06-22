
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Save, ArrowLeft, User, BookOpen, CreditCard } from "lucide-react";
import toast from "react-hot-toast";

interface CourseOption {
  id: string;
  name: string;
  price: number;
  level: string;
}

export default function AdminCreateStudent() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    selectedCourses: [] as string[],
    paymentMethod: "",
    paidAmount: "",
    note: ""
  });

  const courses: CourseOption[] = [
    { id: "1", name: "N5 Hiragana & Katakana", price: 2000000, level: "N5" },
    { id: "2", name: "Giao tiếp hàng ngày", price: 1500000, level: "Cơ bản" },
    { id: "3", name: "Luyện thi JLPT N2", price: 3000000, level: "N2" },
    { id: "4", name: "Business Japanese", price: 2500000, level: "Nâng cao" }
  ];

  const handleCourseToggle = (courseId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCourses: prev.selectedCourses.includes(courseId)
        ? prev.selectedCourses.filter(id => id !== courseId)
        : [...prev.selectedCourses, courseId]
    }));
  };

  const getTotalPrice = () => {
    return formData.selectedCourses.reduce((total, courseId) => {
      const course = courses.find(c => c.id === courseId);
      return total + (course?.price || 0);
    }, 0);
  };

  const getDebtAmount = () => {
    const total = getTotalPrice();
    const paid = parseInt(formData.paidAmount) || 0;
    return Math.max(0, total - paid);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.selectedCourses.length === 0) {
      toast.error("Vui lòng chọn ít nhất một khóa học");
      return;
    }

    console.log("Create student:", {
      ...formData,
      totalPrice: getTotalPrice(),
      debtAmount: getDebtAmount()
    });

    toast.success(`Tài khoản học viên ${formData.name} đã được tạo`);

    navigate("/admin/students");
  };

  return (
    <AdminLayout title="Tạo tài khoản học viên mới">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/students")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          
          <Button type="submit" className="bg-red-600 hover:bg-red-700">
            <Save className="w-4 h-4 mr-2" />
            Tạo tài khoản
          </Button>
        </div>

        {/* Student Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Thông tin học viên
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Họ và tên *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="student@email.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="0901234567"
                />
              </div>
              
              <div>
                <Label htmlFor="password">Mật khẩu *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Mật khẩu đăng nhập"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Chọn khóa học
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.selectedCourses.includes(course.id)
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleCourseToggle(course.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{course.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">{course.level}</Badge>
                        <span className="text-red-600 font-bold">{formatCurrency(course.price)}</span>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 ${
                      formData.selectedCourses.includes(course.id)
                        ? "bg-red-500 border-red-500"
                        : "border-gray-300"
                    }`}>
                      {formData.selectedCourses.includes(course.id) && (
                        <div className="w-full h-full flex items-center justify-center text-white text-xs">✓</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        {formData.selectedCourses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Thông tin thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Tổng học phí</p>
                  <p className="text-lg font-bold text-blue-600">{formatCurrency(getTotalPrice())}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Đã thanh toán</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(parseInt(formData.paidAmount) || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Còn nợ</p>
                  <p className={`text-lg font-bold ${getDebtAmount() > 0 ? "text-red-600" : "text-green-600"}`}>
                    {formatCurrency(getDebtAmount())}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="paymentMethod">Phương thức thanh toán</Label>
                  <Select value={formData.paymentMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phương thức" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="cash">Tiền mặt</SelectItem>
                      <SelectItem value="transfer">Chuyển khoản</SelectItem>
                      <SelectItem value="card">Thẻ tín dụng</SelectItem>
                      <SelectItem value="installment">Trả góp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="paidAmount">Số tiền đã thanh toán</Label>
                  <Input
                    id="paidAmount"
                    type="number"
                    value={formData.paidAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, paidAmount: e.target.value }))}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="note">Ghi chú</Label>
                <Input
                  id="note"
                  value={formData.note}
                  onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                  placeholder="Ghi chú về thanh toán..."
                />
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </AdminLayout>
  );
}

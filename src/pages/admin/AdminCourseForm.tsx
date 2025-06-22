import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, ArrowLeft,  } from "lucide-react";

export default function AdminCourseForm() {
  return (
    <AdminLayout title="Tạo khóa học mới">
      <form className="space-y-6">
        <div className="flex items-center justify-between">
          <Button type="button" variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <Button type="button" className="bg-red-600 hover:bg-red-700">
            <Save className="w-4 h-4 mr-2" />
            Tạo khóa học
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Tên khóa học</Label>
                <Input
                  id="title"
                  value="Khóa học tiếng Hàn sơ cấp"
                  placeholder="VD: Tiếng Nhật cơ bản N5"
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="category">Danh mục</Label>
                <Select value="han">
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="han">Tiếng Hàn</SelectItem>
                    <SelectItem value="nhat">Tiếng Nhật</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="level">Cấp độ</Label>
                <Select value="Cơ bản">
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn cấp độ" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Cơ bản">Cơ bản</SelectItem>
                    <SelectItem value="Trung cấp">Trung cấp</SelectItem>
                    <SelectItem value="Nâng cao">Nâng cao</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Thời lượng</Label>
                <Input
                  id="duration"
                  value="3 tháng"
                  placeholder="VD: 8 tuần"
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="instructor">Giảng viên</Label>
                <Input
                  id="instructor"
                  value="Nguyễn Văn A"
                  placeholder="VD: Tanaka Sensei"
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="status">Trạng thái</Label>
                <Select value="active">
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="active">Kích hoạt</SelectItem>
                    <SelectItem value="inactive">Không kích hoạt</SelectItem>
                    <SelectItem value="draft">Bản nháp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Pricing and Media */}
          <Card>
            <CardHeader>
              <CardTitle>Giá và hình ảnh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="price">Giá hiện tại</Label>
                <Input
                  id="price"
                  value="1.200.000đ"
                  placeholder="VD: 1.299.000đ"
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="originalPrice">Giá gốc (tùy chọn)</Label>
                <Input
                  id="originalPrice"
                  value="1.500.000đ"
                  placeholder="VD: 1.899.000đ"
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="image">Hình ảnh</Label>
                <div className="p-4 bg-gray-100 rounded-md space-y-2">
                  <img
                    src="https://placehold.co/200x150"
                    alt="Thumbnail preview"
                    className="w-full object-contain rounded-md"
                    style={{ maxHeight: "150px" }}
                  />
                  <Button type="button" variant="outline" className="mt-2">
                    Thay đổi thumbnail
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Mô tả khóa học</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value="Khóa học tiếng Hàn dành cho người mới bắt đầu."
              placeholder="Mô tả chi tiết về khóa học..."
              rows={4}
              readOnly
            />
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Tính năng khóa học</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value="Học bảng chữ cái tiếng Hàn"
                placeholder="VD: Học 2 bảng chữ cái cơ bản"
                readOnly
              />
              <Button type="button" variant="outline" disabled>
                Xóa
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                value="Phát âm cơ bản"
                placeholder="VD: Học 2 bảng chữ cái cơ bản"
                readOnly
              />
              <Button type="button" variant="outline" disabled>
                Xóa
              </Button>
            </div>
            <Button type="button" variant="outline" disabled>
              Thêm tính năng
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin khóa học</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value="Không yêu cầu kiến thức nền"
                placeholder="VD: Học 2 bảng chữ cái cơ bản"
                readOnly
              />
              <Button type="button" variant="outline" disabled>
                Xóa
              </Button>
            </div>
            <Button type="button" variant="outline" disabled>
              Thêm thông tin
            </Button>
          </CardContent>
        </Card>
      </form>
    </AdminLayout>
  );
}
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const AdminCategoryForm = () => {
  return (
    <AdminLayout title="Thêm / Sửa danh mục">
      <form className="max-w-md mx-auto p-6 space-y-4">
        <div>
          <label className="block mb-1 font-medium">Tên danh mục</label>
          <Input placeholder="Nhập tên danh mục" disabled value="Danh mục mẫu" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Mô tả</label>
          <Input placeholder="Nhập mô tả" disabled value="Mô tả mẫu cho danh mục" />
        </div>
        <Button className="bg-red-600 hover:bg-red-700 w-full" disabled>Lưu</Button>
      </form>
    </AdminLayout>
  );
};

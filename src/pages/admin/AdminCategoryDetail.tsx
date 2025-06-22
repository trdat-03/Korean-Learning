import { AdminLayout } from "@/components/admin/AdminLayout";

export const AdminCategoryDetail = () => {
  return (
    <AdminLayout title="Chi tiết danh mục">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Tên danh mục: Danh mục mẫu</h2>
        <p className="mb-2">Mô tả: Đây là mô tả mẫu cho danh mục.</p>
        <p className="mb-2">Ngày tạo: 15/03/2024</p>
        <p className="mb-2">Trạng thái: Hiển thị</p>
      </div>
    </AdminLayout>
  );
};

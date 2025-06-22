import { useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  parent_id: string | null;
  is_visible: boolean;
  created_at: string;
  children: Category[];
}

export const AdminCategories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Static data
  const categories: Category[] = [
    {
      id: "1",
      name: "Tiếng Nhật N5",
      description: "Khóa học tiếng Nhật trình độ N5",
      parent_id: null,
      is_visible: true,
      created_at: "2024-03-15",
      children: [
        {
          id: "1-1",
          name: "Hiragana & Katakana",
          description: "Học bảng chữ cái Hiragana và Katakana",
          parent_id: "1",
          is_visible: true,
          created_at: "2024-03-15",
          children: []
        }
      ]
    },
    {
      id: "2",
      name: "Tiếng Nhật N4",
      description: "Khóa học tiếng Nhật trình độ N4",
      parent_id: null,
      is_visible: true,
      created_at: "2024-03-15",
      children: []
    }
  ];

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getParentCategoryName = (parentId?: string | null) => {
    if (!parentId) return null;
    const parent = categories.find((cat) => cat.id === parentId);
    return parent?.name || "Không xác định";
  };

  const renderChildRows = (children: Category[], level: number = 1) => {
    return children.map((child) => (
      <TableRow key={child.id} className="bg-gray-50">
        <TableCell>
          <div
            className="font-medium"
            style={{ paddingLeft: `${level * 20}px` }}
          >
            {child.name}
          </div>
        </TableCell>
        <TableCell>
          {getParentCategoryName(child.parent_id) ? (
            <Badge variant="outline">
              {getParentCategoryName(child.parent_id)}
            </Badge>
          ) : (
            <span className="text-gray-500 text-sm">Danh mục gốc</span>
          )}
        </TableCell>
        <TableCell>
          <div className="max-w-xs truncate">{child.description}</div>
        </TableCell>
        <TableCell>{child.children?.length || 0}</TableCell>
        <TableCell>
          <div className="flex items-center space-x-2">
            <Switch checked={child.is_visible} />
            <Badge
              className={
                child.is_visible
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }
            >
              {child.is_visible ? "Hiển thị" : "Ẩn"}
            </Badge>
          </div>
        </TableCell>
        <TableCell>{new Date(child.created_at).toLocaleDateString()}</TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem asChild>
                <Link to={`/admin/categories/${child.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  Xem chi tiết
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/admin/categories/edit/${child.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="w-full flex items-center">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <AdminLayout title="Quản lý danh mục">
      <div className="space-y-4 sm:space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm danh mục..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Link to="/admin/categories/new" className="w-full sm:w-auto">
            <Button className="bg-red-600 hover:bg-red-700 w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Tạo danh mục mới
            </Button>
          </Link>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên danh mục</TableHead>
                <TableHead>Danh mục cha</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Số khóa học</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <>
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center">
                        {category.children?.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpand(category.id)}
                            className="mr-2 p-0"
                          >
                            {expandedCategories.includes(category.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        <div className="font-medium">{category.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getParentCategoryName(category?.parent_id) ? (
                        <Badge variant="outline">
                          {getParentCategoryName(category?.parent_id)}
                        </Badge>
                      ) : (
                        <span className="text-gray-500 text-sm">
                          Danh mục gốc
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {category?.description}
                      </div>
                    </TableCell>
                    <TableCell>{category.children?.length || 0}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch checked={category.is_visible} />
                        <Badge
                          className={
                            category.is_visible
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {category.is_visible ? "Hiển thị" : "Ẩn"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(category.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white">
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/categories/${category.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/categories/edit/${category.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  {expandedCategories.includes(category.id) &&
                    renderChildRows(category.children || [], 1)}
                </>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="p-4">
              <CardContent className="p-0">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        {category.children?.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpand(category.id)}
                            className="mr-2 p-0"
                          >
                            {expandedCategories.includes(category.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        <Link
                          to={`/admin/categories/${category.id}`}
                          className="font-medium hover:text-blue-600 block truncate"
                        >
                          {category.name}
                        </Link>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {category.description}
                      </p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/categories/${category.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/categories/edit/${category.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {getParentCategoryName(category.parent_id) ? (
                      <Badge variant="outline" className="text-xs">
                        Cha: {getParentCategoryName(category.parent_id)}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Danh mục gốc
                      </Badge>
                    )}
                    <Badge
                      className={`text-xs ${
                        category.is_visible
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {category.is_visible ? "Hiển thị" : "Ẩn"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{category.children?.length || 0} khóa học</span>
                    <span>
                      {new Date(category.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Trạng thái:</span>
                      <Switch checked={category.is_visible} />
                    </div>

                    <div className="flex space-x-2">
                      <Link to={`/admin/categories/${category.id}`}>
                        <Button size="sm" variant="outline" className="text-xs">
                          <Eye className="mr-1 h-3 w-3" />
                          Chi tiết
                        </Button>
                      </Link>
                      <Link to={`/admin/categories/edit/${category.id}`}>
                        <Button size="sm" variant="outline" className="text-xs">
                          <Edit className="mr-1 h-3 w-3" />
                          Sửa
                        </Button>
                      </Link>
                    </div>
                  </div>
                  {expandedCategories.includes(category.id) &&
                    category.children?.length > 0 && (
                      <div className="mt-4 space-y-2 border-l-2 pl-4">
                        {category.children.map((child) => (
                          <Card key={child.id} className="p-3 bg-gray-50">
                            <div className="space-y-2">
                              <Link
                                to={`/admin/categories/${child.id}`}
                                className="font-medium hover:text-blue-600 block truncate"
                              >
                                {child.name}
                              </Link>
                              <p className="text-sm text-gray-500 line-clamp-2">
                                {child.description}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="text-xs">
                                  Cha: {getParentCategoryName(child.parent_id)}
                                </Badge>
                                <Badge
                                  className={`text-xs ${
                                    child.is_visible
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {child.is_visible ? "Hiển thị" : "Ẩn"}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>
                                  {child.children?.length || 0} khóa học
                                </span>
                                <span>
                                  {new Date(
                                    child.created_at
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm">Trạng thái:</span>
                                  <Switch checked={child.is_visible} />
                                </div>
                                <div className="flex space-x-2">
                                  <Link to={`/admin/categories/${child.id}`}>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      <Eye className="mr-1 h-3 w-3" />
                                      Chi tiết
                                    </Button>
                                  </Link>
                                  <Link
                                    to={`/admin/categories/edit/${child.id}`}
                                  >
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      <Edit className="mr-1 h-3 w-3" />
                                      Sửa
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

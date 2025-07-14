// Header.tsx
import { Button } from "@/components/ui/button";
import { BookOpen, User, Menu, Award } from "lucide-react";
import { useState, useEffect } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constant/route";
import { useLogout } from "./useLogout";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import type { CourseCategory } from "@/models/CourseCategory"; 

export const Header = () => {
  const logout = useLogout();
  const { isAuthenticated, currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const resp = await axios.get("http://localhost:8080/api/course-categories");

        setCategories(resp.data);
      } catch {
        setError("Không thể tải danh mục khóa học");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-red-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">한국어 학원</h1>
            <p className="text-xs text-gray-600">Korean Academy</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-700 hover:text-red-600">
                  Khóa học
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white">
                  <div className=" w-[800px]">
                    {loading && <p>Đang tải danh mục...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loading && !error && (
                      <div className="flex gap-8 p-6 w-full max-w-6xl">
                        {categories.map((category) => (
                          <div
                            key={category.id}
                            className="min-w-[220px] bg-red-50/40 rounded-xl shadow-sm border border-red-100 p-4 space-y-3 transition hover:shadow-md"
                          >
                            <h4 className="font-bold text-red-700 text-base flex items-center gap-2 border-b border-red-200 pb-1">
                              {category.name}
                            </h4>
                            <ul className="space-y-2">
                              {category.subCategories.map((sub) => (
                                <li key={sub.id}>
                                  <Link
                                    to={`/courses/${sub.id}`}
                                    className="block p-2 rounded-md hover:bg-red-100/70 hover:scale-[1.03] transition-all duration-150"
                                  >
                                    <div className="text-sm font-medium text-gray-900">{sub.title}</div>
                                    <div className="text-xs text-gray-500">Số bài học: {sub.lessonCount}</div>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                            <Link
                              to={`/courses?categoryId=${category.id}`}
                              className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-white hover:bg-red-600 border border-red-200 rounded px-2 py-1 font-medium transition"
                            >
                              Xem tất cả {category.name}
                              <span className="ml-1">→</span>
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gray-100 p-4">
                    <Link
                      to="/courses"
                      className="block text-center text-red-600 hover:text-white hover:bg-red-600 font-medium rounded px-3 py-2 transition"
                    >
                      Xem tất cả khóa học →
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Các link tĩnh */}
          <a href="#features" className="text-gray-700 hover:text-red-600 transition-colors">Tính năng</a>
          <a href="#testimonials" className="text-gray-700 hover:text-red-600 transition-colors">Đánh giá</a>
          <a href="#contact" className="text-gray-700 hover:text-red-600 transition-colors">Liên hệ</a>
          <a href="/chat-topics"  className="text-gray-700 hover:text-red-600 transition-colors">Đối thoại</a>
          <a href="/flashcards"  className="text-gray-700 hover:text-red-600 transition-colors">Flashcard</a>
           <a href="/subscription"  className="text-gray-700 hover:text-red-600 transition-colors">Nâng cấp</a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={"/images/avatar.avif"} alt={currentUser?.fullName || "User Avatar"} />
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{currentUser?.fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{currentUser?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Quản lý tài khoản</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/certificates">
                    <Award className="mr-2 h-4 w-4" />
                    <span>Danh sách chứng chỉ</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Đăng xuất</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" className="text-gray-700" onClick={() => nav(ROUTES.LOGIN)}>
                <User className="w-4 h-4 mr-2" />
                Đăng nhập
              </Button>
              <Button className="bg-red-600 hover:bg-red-700" onClick={() => nav(ROUTES.REGISTER)}>
                Đăng ký ngay
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-red-100 p-4">
          <nav className="flex flex-col space-y-4">
            <Link to="/courses" className="text-gray-700 hover:text-red-600 transition-colors">Khóa học</Link>
            <a href="#features" className="text-gray-700 hover:text-red-600 transition-colors">Tính năng</a>
            <a href="#testimonials" className="text-gray-700 hover:text-red-600 transition-colors">Đánh giá</a>
            <a href="#contact" className="text-gray-700 hover:text-red-600 transition-colors">Liên hệ</a>

            <div className="pt-4 border-t border-red-100 flex flex-col space-y-2">
              {isAuthenticated ? (
                <>
                  <Link to="/profile">
                    <Button variant="ghost" className="justify-start w-full">
                      <User className="w-4 h-4 mr-2" />
                      Quản lý tài khoản
                    </Button>
                  </Link>
                  <Link to="/certificates">
                    <Button variant="ghost" className="justify-start w-full">
                      <Award className="w-4 h-4 mr-2" />
                      Danh sách chứng chỉ
                    </Button>
                  </Link>
                  <Button variant="ghost" onClick={logout} className="justify-start w-full">Đăng xuất</Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="justify-start" onClick={() => nav(ROUTES.LOGIN)}>
                    <User className="w-4 h-4 mr-2" />Đăng nhập
                  </Button>
                  <Button className="bg-red-600 hover:bg-red-700" onClick={() => nav(ROUTES.REGISTER)}>Đăng ký ngay</Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

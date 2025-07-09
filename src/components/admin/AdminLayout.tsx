  import type { ReactNode } from "react";
  import { useState } from "react";
  import { Link, useLocation } from "react-router-dom";
  import {
    LayoutDashboard,
    BookOpen,
    Users,
    FileText,
    Video,
    Settings,
    CreditCard,
    MessageCircle,
    LogOut,
    Menu,
    X,
  } from "lucide-react";
  import { Button } from "@/components/ui/button";

  interface AdminLayoutProps {
    children: ReactNode;
    title: string;
  }

  export function AdminLayout({ children, title }: AdminLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    const navigation = [
      {
        name: "Tổng quan",
        href: "/admin",
        icon: LayoutDashboard,
      },
      {
        name: "Chat",
        href: "/admin/chat",
        icon: MessageCircle,
      },
      {
        name: "Khóa học",
        href: "/admin/courses",
        icon: BookOpen,
      },
      {
        name: "Học sinh",
        href: "/admin/students",
        icon: Users,
      },
      {
        name: "Tài liệu",
        href: "/admin/materials",
        icon: FileText,
      },
      {
        name: "Video",
        href: "/admin/videos",
        icon: Video,
      },
      {
        name: "Cài đặt",
        href: "/admin/settings",
        icon: Settings,
      },
      {
        name: "Subscription",
        href: "/admin/subscription",
        icon: CreditCard,
      },
    ];

    return (
      <div className="min-h-screen bg-gray-100">
        {/* Mobile sidebar toggle */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Logo */}
            <div className="h-16 flex items-center justify-center border-b">
              <Link to="/admin" className="text-xl font-bold text-red-600">
                Admin Panel
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? "bg-red-50 text-red-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* User info & Logout */}
            <div className="p-4 border-t">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 font-medium">A</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@example.com</p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-red-600"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Đăng xuất
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main
          className={`min-h-screen transition-all duration-200 ease-in-out ${
            isSidebarOpen ? "lg:ml-64" : ""
          }`}
        >
          <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{title}</h1>
            {children}
          </div>
        </main>
      </div>
    );
  } 
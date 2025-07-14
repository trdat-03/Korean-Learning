import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Plus,
  GraduationCap,
} from 'lucide-react';

const menuItems = [
  {
    title: 'Khóa học của tôi',
    icon: BookOpen,
    path: '/teacher/courses',
  },
  {
    title: 'Tạo khóa học',
    icon: Plus,
    path: '/teacher/courses/create',
  },
  {
    title: 'Quản lý học sinh',
    icon: Users,
    path: '/teacher/students',
  },
];

export const TeacherSidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-sm border-r overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-6">
          <GraduationCap className="w-8 h-8 text-blue-600" />
          <span className="font-bold text-lg">Teacher Portal</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/teacher/courses'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

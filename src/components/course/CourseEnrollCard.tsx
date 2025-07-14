import React from 'react';
import type { CourseDetail } from '@/models/CourseDetail';
import { useAuth } from '@/hooks/useAuth';

interface CourseEnrollCardProps {
  course: CourseDetail;
  isEnrolled: boolean;
  onAction: () => void;
  onPreview?: () => void;
}

export const CourseEnrollCard: React.FC<CourseEnrollCardProps> = ({
  course,
  isEnrolled,
  onAction,
  onPreview,
}) => {
  const { isAuthenticated } = useAuth();
  const quickInfo = [
    { icon: "📚", label: "Tổng số bài học" },
    { icon: "⏰", label: "Học theo tốc độ của bạn" },
    { icon: "🌍", label: "Học mọi lúc, mọi nơi" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-4">
      <div className="w-full mb-4 flex justify-center">
        <img
          src={`/images/${course.image}`}
          alt="Course Banner"
          className="rounded-lg max-w-full h-auto object-contain bg-red-50 border border-red-100"
          style={{ maxHeight: 220 }}
        />
      </div>
      <div className="text-center mb-2">
        <span className="text-3xl font-bold text-red-600">Miễn phí</span>
      </div>
      
      {isAuthenticated ? (
        isEnrolled ? (
          <button
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded mb-4 transition"
            onClick={onAction}
          >
            TIẾP TỤC HỌC TẬP
          </button>
        ) : (
          <div className="space-y-2 mb-4">
            <button
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded transition"
              onClick={onAction}
            >
              ĐĂNG KÝ HỌC
            </button>
            {onPreview && (
              <button
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 rounded transition"
                onClick={onPreview}
              >
                XEM THỬ
              </button>
            )}
          </div>
        )
      ) : (
        <div className="space-y-2 mb-4">
          <button
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded transition"
            onClick={onAction}
          >
            ĐĂNG KÝ HỌC
          </button>
          {onPreview && (
            <button
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 rounded transition"
              onClick={onPreview}
            >
              XEM THỬ
            </button>
          )}
        </div>
      )}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-red-600">⭐</span>
          <span>Trình độ cơ bản</span>
        </div>
        {quickInfo.map((info, i) => (
          <div key={i} className="flex items-center gap-2">
            <span>{info.icon}</span>
            <span>{info.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}; 
import React from 'react';
import type { CourseDetail } from '@/models/CourseDetail';

interface CourseContentProps {
  course: CourseDetail;
}

export const CourseContent: React.FC<CourseContentProps> = ({ course }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold">Nội dung khóa học</h2>
      </div>
      <div className="text-gray-600 mb-4 text-sm">
        {course.lessons.length} bài học • Giảng viên: {course.teacherName}
      </div>
      <div className="space-y-3">
        {course.lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="flex items-center justify-between bg-gray-100 rounded px-4 py-3 font-medium text-base hover:bg-gray-200 transition cursor-pointer"
          >
            <span>
              <span className="text-red-500 mr-2">+</span>
              {lesson.title}
            </span>
            <span className="text-gray-600 text-sm">
              {lesson.vocabularyCount} từ vựng, {lesson.grammarCount} ngữ pháp
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}; 
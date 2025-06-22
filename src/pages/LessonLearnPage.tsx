import React, { useEffect, useState } from 'react';
import type {LessonDetailType} from '../models/LessonDetail';
import Lesson from '../components/Lesson';
import LessonList from '../components/LessonList';
import { useParams } from 'react-router-dom';
import {Header} from '../components/Header';

const LessonLearnPage: React.FC = () => {
  const { id } = useParams(); // lấy course id từ URL
  const [lessons, setLessons] = useState<LessonDetailType[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);

  // Gọi API khi có ID
  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:8080/api/courses/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const fetchedLessons: LessonDetailType[] = data.lessons || [];
        setLessons(fetchedLessons);

        // Chọn bài đầu tiên mặc định
        if (fetchedLessons.length > 0) {
          setSelectedLessonId(fetchedLessons[0].id);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải danh sách bài học:", error);
      });
  }, [id]);

  const selectedLesson = lessons.find((lesson) => lesson.id === selectedLessonId);

  return (
  <>
    <Header />
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar bài học */}
          <div className="lg:col-span-4">
            <div className="sticky top-6">
              <LessonList
                lessons={lessons}
                selectedLessonId={selectedLessonId ?? 0}
                onSelectLesson={(lesson) => setSelectedLessonId(lesson.id)}
              />
            </div>
          </div>

          {/* Nội dung bài học */}
          <div className="lg:col-span-8">
            {selectedLesson ? (
              <Lesson lesson={selectedLesson} />
            ) : (
              <p className="text-center text-gray-500">Chưa có bài học nào.</p>
            )}
          </div>
        </div>
      </div>
    </div>
     </>
  );
};

export default LessonLearnPage;

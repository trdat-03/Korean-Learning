
import { Button } from "@/components/ui/button";
import { Play, Star, Users, BookOpen } from "lucide-react";

export const Hero = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium">
                🎌 Công cụ học tập hiện đại
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Học tiếng Hàn
                <span className="text-red-600 block">hiệu quả</span>
                cùng công cụ AI
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Các công cụ hỗ trợ đa dạng nhằm giúp ghi nhớ từ vựng, ngữ pháp, và phát âm tiếng Hàn một cách hiệu quả và bền vững.
                Tiết kiệm thời gian và nâng cao hiệu suất học tập.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg px-8 py-6">
                <Play className="w-5 h-5 mr-2" />
                Bắt đầu học ngay
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-red-200 hover:bg-red-50">
                Xem khóa học
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-red-100">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-2xl font-bold text-gray-900">4.9</span>
                </div>
                <p className="text-sm text-gray-600">Đánh giá từ học viên</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <Users className="w-5 h-5 text-red-600" />
                  <span className="text-2xl font-bold text-gray-900">10K+</span>
                </div>
                <p className="text-sm text-gray-600">Học viên đã tham gia</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <BookOpen className="w-5 h-5 text-red-600" />
                  <span className="text-2xl font-bold text-gray-900">50+</span>
                </div>
                <p className="text-sm text-gray-600">Khóa học đa dạng</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 border border-red-100">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full mx-auto flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">한</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Thoả sức luyện tập</h3>
                  <p className="text-gray-600">Tiến bộ nhanh chóng và đạt mục tiêu đề ra</p>
                </div>
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Trải nghiệm ngay
                </Button>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-red-200 rounded-full opacity-60"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-red-300 rounded-full opacity-40"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

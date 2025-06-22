
import { Button } from "@/components/ui/button";
import { BookOpen, Mail, Phone, MapPin, Facebook, Youtube, MessageCircle } from "lucide-react";

export const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="container mx-auto max-w-6xl px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">한국어 학원</h3>
                <p className="text-sm text-gray-400">Korean Academy</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Nền tảng học tập tiếng Hàn hàng đầu Việt Nam với phương pháp học tập hiện đại và công cụ AI hỗ trợ mạnh mẽ.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-red-600">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-red-600">
                <Youtube className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-red-600">
                <MessageCircle className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Liên kết nhanh</h4>
            <ul className="space-y-3">
              {[
                "Trang chủ",
                "Khóa học",
                "Giảng viên",
                "Về chúng tôi",
                "Liên hệ",
                "Blog"
              ].map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-300 hover:text-red-400 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Khóa học phổ biến</h4>
            <ul className="space-y-3">
              {[
                "Tiếng Hàn sơ cấp",
                "Tiếng Hàn trung cấp",
                "Tiếng Hàn cao cấp",
                "Tiếng Hàn giao tiếp",
                "Ôn thi TOPIK",
                "Phát âm chuẩn"
              ].map((course, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-300 hover:text-red-400 transition-colors">
                    {course}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Thông tin liên hệ</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                <p className="text-gray-300">
                  470 Trần Đại Nghĩa, Ngũ Hành Sơn<br />
                  TP. Đà Nẵng, Việt Nam
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-red-400" />
                <p className="text-gray-300">(+84) 359 941 290</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-red-400" />
                <p className="text-gray-300">info@korean-academy.vn</p>
              </div>
            </div>
            <Button className="w-full bg-red-600 hover:bg-red-700">
              Tư vấn miễn phí
            </Button>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Korean Academy. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

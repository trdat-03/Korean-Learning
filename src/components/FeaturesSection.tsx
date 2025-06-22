
import { Card, CardContent } from "@/components/ui/card";
import { Play, Users, Award, Globe, BookOpen, MessageCircle } from "lucide-react";

const features = [
  {
    icon: Play,
    title: "Video HD chất lượng cao",
    description: "Học với video chất lượng 4K, âm thanh rõ ràng từ giảng viên bản xứ"
  },
  {
    icon: Users,
    title: "Lớp học tương tác",
    description: "Tham gia lớp học trực tiếp với giảng viên và học viên khác"
  },
  {
    icon: Award,
    title: "Chứng chỉ quốc tế",
    description: "Nhận chứng chỉ được công nhận sau khi hoàn thành khóa học"
  },
  {
    icon: Globe,
    title: "Học mọi lúc, mọi nơi",
    description: "Truy cập trên máy tính, điện thoại, tablet. Học offline được"
  },
  {
    icon: BookOpen,
    title: "Tài liệu đầy đủ",
    description: "Sách điện tử, bài tập, quiz và tài liệu bổ trợ miễn phí"
  },
  {
    icon: MessageCircle,
    title: "Hỗ trợ 24/7",
    description: "Đội ngũ hỗ trợ học tập và kỹ thuật luôn sẵn sàng giúp đỡ"
  }
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            ⭐ Tính năng nổi bật
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Tại sao chọn chúng tôi?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Phương pháp học hiện đại kết hợp công nghệ và trải nghiệm học tập tuyệt vời
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-red-100 hover:border-red-200">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

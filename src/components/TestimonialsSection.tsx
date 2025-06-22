
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Nguyễn Thị Mai",
    role: "Nhân viên văn phòng",
    content: "Tôi đã học được rất nhiều từ khóa học này. Giảng viên rất nhiệt tình và phương pháp giảng dạy dễ hiểu. Sau 3 tháng học, tôi đã có thể giao tiếp cơ bản với đồng nghiệp Nhật Bản.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=100&h=100&fit=crop&crop=face"
  },
  {
    name: "Trần Văn Nam",
    role: "Sinh viên",
    content: "Khóa học rất chất lượng với giá cả hợp lý. Video học rõ ràng, bài tập phong phú. Đặc biệt là phần luyện phát âm với giảng viên bản xứ giúp tôi tiến bộ nhanh chóng.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },
  {
    name: "Lê Thị Hương",
    role: "Kế toán",
    content: "Tôi rất hài lòng với chất lượng khóa học. Từ chỗ không biết gì về tiếng Nhật, giờ tôi đã có thể đọc hiểu Hiragana và Katakana. Sẽ tiếp tục học các khóa nâng cao.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  }
];

export const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            💬 Đánh giá từ học viên
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Học viên nói gì về chúng tôi
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hàng nghìn học viên đã thành công với phương pháp học tập của chúng tôi
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-red-100">
              <CardContent className="p-8 space-y-6">
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center space-x-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

import { 
  BookOpen, 
  Users, 
  MessageSquare, 
  Trophy, 
  Clock,
  Star,
  Brain,
  Target,
  Zap,
  Heart,
  Globe
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Flashcard thông minh",
      description: "Tạo và học từ vựng với thẻ flashcard tương tác, có thể nhập hoặc phân tích hình ảnh bằng AI",
      color: "from-red-500 to-rose-600",
      bgColor: "bg-red-50",
      iconColor: "text-red-600"
    },
    {
      icon: Target,
      title: "Trò chơi ghép từ",
      description: "Luyện tập từ vựng qua trò chơi ghép từ tiếng Hàn - tiếng Việt có thời gian thử thách",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    },
    {
      icon: Brain,
      title: "Luyện ngữ pháp AI",
      description: "AI thông minh kiểm tra ngữ pháp, sửa lỗi và đưa ra gợi ý cải thiện chi tiết",
      color: "from-pink-500 to-red-500",
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600"
    },
    {
      icon: Users,
      title: "Khóa học đa cấp độ",
      description: "Hệ thống bài học từ sơ cấp đến cao cấp với từ vựng và ngữ pháp có cấu trúc",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600"
    },
    {
      icon: MessageSquare,
      title: "Chat AI thông minh",
      description: "Chat trực tiếp với AI trợ giảng và giảng viên để được hỗ trợ học tập 24/7",
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600"
    },
    {
      icon: Zap,
      title: "Phân tích hình ảnh AI",
      description: "Công nghệ AI phân tích hình ảnh để tự động tạo từ vựng tiếng Hàn từ ảnh",
      color: "from-blue-500 to-indigo-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: Clock,
      title: "Luyện tập đa dạng",
      description: "Hệ thống ôn tập với nhiều dạng bài tập: trắc nghiệm, tự luận, flashcard",
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      icon: Trophy,
      title: "Bài kiểm tra AI",
      description: "Hệ thống bài kiểm tra thông minh với AI đánh giá quá trình học tập và cấp chứng chỉ",
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-50",
      iconColor: "text-red-600"
    },
    {
      icon: Globe,
      title: "Hỗ trợ tin nhắn",
      description: "Hỗ trợ trực tiếp qua tin nhắn nhanh chóng từ đội ngũ giảng viên chuyên nghiệp",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600"
    }
  ];

  const stats = [
    { number: "10K+", label: "Học viên tin tưởng", icon: Users },
    { number: "50+", label: "Khóa học chất lượng", icon: BookOpen },
    { number: "4.9", label: "Đánh giá trung bình", icon: Star },
    { number: "95%", label: "Tỷ lệ thành công", icon: Trophy }
  ];

  return (
    <section id='features' className="py-20 px-4 bg-gradient-to-br from-gray-50 via-white to-red-50">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Heart className="w-4 h-4 mr-2" />
            Tính năng nổi bật
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Tại sao chọn
            <span className="text-red-600 block lg:inline lg:ml-3">한국어 학원?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Chúng tôi mang đến trải nghiệm học tiếng Hàn tốt nhất với công nghệ hiện đại
            và phương pháp giảng dạy được chứng minh hiệu quả.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              
              <div className="relative p-8">
                {/* Icon */}
                <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-red-200 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-red-300 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-12 text-white relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full translate-x-20 translate-y-20"></div>
            <div className="absolute top-1/2 left-1/4 w-6 h-6 bg-white opacity-20 rounded-full"></div>
            <div className="absolute top-1/4 right-1/3 w-4 h-4 bg-white opacity-30 rounded-full"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 mr-3" />
                <h3 className="text-3xl font-bold">Sẵn sàng bắt đầu hành trình?</h3>
              </div>
              <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
                Tham gia cùng hàng ngàn học viên đã thành công trong việc chinh phục tiếng Hàn
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-red-600 px-8 py-4 rounded-full font-semibold hover:bg-red-50 transition-colors duration-300 shadow-lg hover:shadow-xl">
                  Khám phá khóa học
                </button>
                <button className="bg-red-700 text-white px-8 py-4 rounded-full font-semibold hover:bg-red-800 transition-colors duration-300 border-2 border-red-600">
                  Tư vấn miễn phí
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

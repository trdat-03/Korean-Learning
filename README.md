# Korean Learning Platform

## Phân tích đối tượng sử dụng và chức năng

| Đối tượng | Họ được làm gì? | Chức năng hệ thống cung cấp |
|-----------|----------------|---------------------------|
| **Học viên** | - Học từ vựng và ngữ pháp<br>- Luyện tập phát âm<br>- Làm bài tập tương tác<br>- Chat với AI trợ giảng<br>- Theo dõi tiến độ học tập | - Flashcard thông minh với phân tích hình ảnh<br>- Bài tập ghép từ vựng (Matching)<br>- Bài tập ngữ pháp tương tác<br>- Chatbot AI hỗ trợ học tập<br>- Nhận dạng giọng nói và phát âm<br>- Dịch thuật thông minh<br>- Theo dõi tiến độ trực quan |
| **Giáo viên/Admin** | - Quản lý khóa học<br>- Quản lý học viên<br>- Theo dõi tiến độ học viên<br>- Tạo và chỉnh sửa nội dung | - Hệ thống quản lý khóa học<br>- Quản lý danh sách học viên<br>- Thống kê và báo cáo<br>- Công cụ tạo nội dung học tập |
| **Khách (Chưa đăng ký)** | - Xem thông tin khóa học<br>- Dùng thử một số tính năng cơ bản<br>- Đăng ký tài khoản | - Xem demo khóa học<br>- Trang giới thiệu tính năng<br>- Form đăng ký/đăng nhập |

## Mô tả đề tài
Korean Learning Platform là một nền tảng học tiếng Hàn trực tuyến toàn diện, được thiết kế để giúp người Việt Nam học tiếng Hàn một cách hiệu quả và thú vị. Nền tảng kết hợp các phương pháp học tập truyền thống với công nghệ hiện đại, tạo ra một môi trường học tập tương tác và cá nhân hóa.

### Đặc điểm nổi bật
1. **Học tập cá nhân hóa**: Hệ thống theo dõi tiến độ và điều chỉnh nội dung học tập phù hợp với trình độ của từng học viên.
2. **Tương tác thông minh**: Tích hợp chatbot thông minh hỗ trợ học tập và AI phân tích phát âm.
3. **Đa dạng phương pháp**: Kết hợp nhiều phương pháp học tập khác nhau (video, flashcard, practice, matching).
4. **Công nghệ hiện đại**: Sử dụng công nghệ nhận dạng giọng nói và text-to-speech để hỗ trợ phát âm.

## Mục tiêu cụ thể

### 1. Mục tiêu về chức năng
- [x] **Quản lý khóa học**
  - Phân loại khóa học theo cấp độ (Sơ cấp, Trung cấp, Cao cấp)
  - Tổ chức bài học theo chủ đề và mục tiêu học tập
  - Theo dõi tiến độ học tập của học viên

- [x] **Hệ thống học tập tương tác**
  - Flashcard thông minh với phân tích hình ảnh tự động
  - Bài tập ghép từ vựng (Vocabulary Matching)
  - Bài tập ngữ pháp tương tác
  - Luyện tập phát âm với AI

- [x] **Trợ lý học tập AI**
  - Chat với AI để luyện tập hội thoại
  - Phân tích và sửa lỗi phát âm
  - Gợi ý từ vựng và ngữ pháp phù hợp
  - Dịch thuật thông minh

- [x] **Quản lý người dùng**
  - Hệ thống xác thực và phân quyền
  - Theo dõi tiến độ học tập

### 2. Mục tiêu về trải nghiệm người dùng
- [x] **Giao diện thân thiện**
  - Thiết kế responsive trên mọi thiết bị
  - UI/UX hiện đại và dễ sử dụng
  - Hướng dẫn sử dụng chi tiết

- [x] **Tính năng cá nhân hóa**
  - Tùy chỉnh lộ trình học tập
  - Theo dõi tiến độ trực quan
  - Nhắc nhở và động viên học tập

### 3. Mục tiêu về hiệu suất
- [x] **Tối ưu hóa hệ thống**
  - Tải trang nhanh và mượt mà
  - Xử lý dữ liệu hiệu quả
  - Đồng bộ hóa realtime

- [x] **Khả năng mở rộng**
  - Kiến trúc module hóa
  - Dễ dàng thêm tính năng mới
  - Hỗ trợ nhiều người dùng đồng thời

### 4. Mục tiêu về giáo dục
- [x] **Nội dung chất lượng**
  - Bài học được biên soạn kỹ lưỡng
  - Cập nhật thường xuyên
  - Phù hợp với nhiều đối tượng

- [x] **Phương pháp học tập hiệu quả**
  - Học theo chủ đề thực tế
  - Luyện tập tương tác
  - Đánh giá tiến độ thường xuyên

## Công nghệ sử dụng
- Frontend: React, TypeScript, Tailwind CSS
- UI Components: Shadcn/ui
- Form Management: React Hook Form, Zod
- API Integration: Axios
- Speech Recognition & Synthesis
- AI Integration for chat and analysis

## Hướng phát triển tương lai
1. Tích hợp machine learning để cá nhân hóa học tập tốt hơn
2. Thêm tính năng học nhóm và tương tác giữa học viên
3. Phát triển ứng dụng di động native
4. Mở rộng nội dung và bài tập
5. Tích hợp thanh toán và gói học phí

## Cài đặt và Phát triển

```bash
# Clone dự án
git clone [repository-url]

# Cài đặt dependencies
npm install

# Chạy môi trường development
npm run dev

# Build cho production
npm run build
```

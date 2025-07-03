# Subscription System Documentation

## Tổng quan

Hệ thống subscription cho ứng dụng học tiếng Hàn bao gồm frontend và backend components để quản lý gói đăng ký của người dùng.

## Kiến trúc

### Frontend Components

#### Pages
- `SubscriptionPlansPage` - Hiển thị các gói subscription
- `SubscriptionPaymentPage` - Xử lý thanh toán
- `SubscriptionStatusPage` - Hiển thị trạng thái subscription
- `AdminSubscriptionDashboard` - Quản lý giao dịch cho admin

#### Components
- `SubscriptionPlanCard` - Card hiển thị từng gói
- `PaymentInfoComponent` - Hiển thị thông tin chuyển khoản
- `ConfirmPayment` - Form xác nhận thanh toán
- `AdminTransactionTable` - Bảng quản lý giao dịch
- `SubscriptionNav` - Navigation cho subscription

#### Services
- `subscriptionService` - API calls cho subscription

#### Hooks
- `useSubscription` - Hook quản lý state subscription

### API Endpoints

#### User APIs
```
GET /api/subscriptions/plans - Lấy danh sách gói
POST /api/subscriptions/subscribe - Tạo giao dịch
POST /api/subscriptions/confirm-payment - Xác nhận thanh toán
GET /api/subscriptions/user/{userId}/active - Kiểm tra subscription
```

#### Admin APIs
```
GET /api/admin/pending-transactions - Giao dịch chờ duyệt
POST /api/admin/confirm-payment/{transactionId} - Duyệt/từ chối
```

## Luồng hoạt động

### User Flow
1. Xem danh sách gói → `/subscription`
2. Chọn gói → Tạo giao dịch
3. Hiển thị thông tin thanh toán + QR code
4. User chuyển khoản và xác nhận
5. Chờ admin duyệt

### Admin Flow
1. Xem giao dịch chờ duyệt → `/admin/subscription`
2. Kiểm tra thông tin
3. Duyệt/từ chối

## Routes

```typescript
/subscription - Trang chọn gói
/subscription/payment - Trang thanh toán
/subscription/status - Trang trạng thái
/admin/subscription - Dashboard admin
```

## Types

```typescript
interface SubscriptionPlan {
  name: string;
  displayName: string;
  durationMonths: number;
  priceVND: number;
  aiUsageLimit: number;
  features: string[];
}

interface ActiveSubscription {
  hasActiveSubscription: boolean;
  subscriptionType: string;
  startDate: string;
  endDate: string;
  isValid: boolean;
}
```

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install qrcode @types/qrcode
```

2. Import components vào routing:
```typescript
import SubscriptionPlansPage from './pages/subscription/SubscriptionPlansPage';
// ... other imports
```

3. Thêm routes vào App.tsx

## Tính năng

### User Features
- ✅ Xem danh sách gói subscription
- ✅ Chọn và thanh toán gói
- ✅ QR code chuyển khoản
- ✅ Xác nhận thanh toán
- ✅ Xem trạng thái subscription
- ✅ Copy thông tin thanh toán

### Admin Features
- ✅ Xem giao dịch chờ duyệt
- ✅ Duyệt/từ chối thanh toán
- ✅ Real-time update trạng thái

### UI/UX Features
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications
- ✅ Modern card layouts
- ✅ Badge status indicators

## Customization

### Thêm gói mới
Backend sẽ trả về danh sách gói từ `/api/subscriptions/plans`

### Thay đổi UI
Components sử dụng Tailwind CSS và shadcn/ui components

### Thêm payment methods
Hiện tại chỉ hỗ trợ chuyển khoản ngân hàng, có thể mở rộng thêm

## Security

- ✅ Input validation
- ✅ Authentication required
- ✅ Admin permission checks
- ✅ Secure payment confirmation

## Testing

Checklist test:
- [ ] Hiển thị đúng danh sách plans
- [ ] Tạo giao dịch thành công
- [ ] QR code render đúng
- [ ] Copy clipboard hoạt động
- [ ] Admin approve/reject
- [ ] Responsive mobile
- [ ] Error handling

## Troubleshooting

### QR Code không hiển thị
- Kiểm tra cài đặt `qrcode` package
- Kiểm tra dữ liệu `qrCodeData` từ API

### Payment không hoạt động
- Kiểm tra backend API endpoints
- Kiểm tra authentication token

### Admin dashboard trống
- Kiểm tra quyền admin
- Kiểm tra API `/admin/pending-transactions`

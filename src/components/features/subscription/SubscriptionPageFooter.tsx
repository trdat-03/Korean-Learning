import React from 'react';

export const SubscriptionPageFooter: React.FC = () => {
  return (
    <div className="mt-12 text-center text-sm text-gray-600">
      <p>
        Bằng việc đăng ký, bạn đồng ý với{' '}
        <a href="/terms" className="text-blue-600 hover:underline">
          Điều khoản dịch vụ
        </a>{' '}
        và{' '}
        <a href="/privacy" className="text-blue-600 hover:underline">
          Chính sách bảo mật
        </a>{' '}
        của chúng tôi.
      </p>
    </div>
  );
};

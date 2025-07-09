import { Crown, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SubscriptionNavProps {
  className?: string;
}

export const SubscriptionNav: React.FC<SubscriptionNavProps> = ({ className }) => {
  const location = useLocation();

  const navItems = [
    {
      path: '/subscription',
      label: 'Gói Subscription',
      icon: Crown
    },
    {
      path: '/subscription/status',
      label: 'Trạng thái',
      icon: Settings
    }
  ];

  return (
    <nav className={cn('flex gap-4', className)}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              isActive
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

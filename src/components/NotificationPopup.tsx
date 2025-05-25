
import React, { useState, useEffect } from 'react';
import { X, AlertCircle, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface NotificationPopupProps {
  title: string;
  message: string;
  type: 'warning' | 'info';
  onClose: () => void;
}

export const NotificationPopup: React.FC<NotificationPopupProps> = ({
  title,
  message,
  type,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const Icon = type === 'warning' ? AlertCircle : MessageSquare;
  const bgColor = type === 'warning' ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200';
  const iconColor = type === 'warning' ? 'text-orange-500' : 'text-blue-500';

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      }`}
    >
      <Card className={`w-80 ${bgColor} shadow-lg`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Icon className={`w-5 h-5 mt-0.5 ${iconColor}`} />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
              <p className="text-sm text-gray-700">{message}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

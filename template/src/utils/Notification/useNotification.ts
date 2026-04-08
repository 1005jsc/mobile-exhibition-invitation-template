import { toast } from 'sonner';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationOptions {
  description?: string;
  duration?: number;
}

export const useNotification = () => {
  const showNotification = (
    type: NotificationType,
    title: string,
    options?: NotificationOptions,
  ) => {
    switch (type) {
      case 'success':
        toast.success(title, options);
        break;
      case 'error':
        toast.error(title, options);
        break;
      case 'info':
        toast.info(title, options);
        break;
      case 'warning':
        toast.warning(title, options);
        break;
      default:
        toast(title, options);
    }
  };

  return {
    showNotification,
  };
};

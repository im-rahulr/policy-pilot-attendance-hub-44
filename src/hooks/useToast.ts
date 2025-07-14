import { toast } from "sonner";

export const useToast = () => {
  const showSuccess = (message: string) => {
    toast.success(message, {
      style: {
        background: '#10b981',
        color: 'white',
        border: 'none'
      }
    });
  };

  const showError = (message: string) => {
    toast.error(message, {
      style: {
        background: '#ef4444',
        color: 'white',
        border: 'none'
      }
    });
  };

  const showInfo = (message: string) => {
    toast.info(message, {
      style: {
        background: '#3b82f6',
        color: 'white',
        border: 'none'
      }
    });
  };

  const showWarning = (message: string) => {
    toast.warning(message, {
      style: {
        background: '#f59e0b',
        color: 'white',
        border: 'none'
      }
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning
  };
};

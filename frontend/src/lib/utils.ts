import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from 'sonner';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Toast utility functions for handling notifications based on server responses
 */

interface ServerResponse {
  success?: boolean;
  message?: string;
  data?: any;
}

/**
 * Shows a toast based on server response
 * @param response - Server response object
 * @param successMessage - Custom success message (optional)
 * @param errorMessage - Custom error message (optional)
 */
export const handleServerResponse = (
  response: ServerResponse,
  successMessage?: string,
  errorMessage?: string
) => {
  if (response.success) {
    toast.success(successMessage || response.message || 'Operation completed successfully');
  } else {
    toast.error(errorMessage || response.message || 'Operation failed');
  }
};

/**
 * Shows a toast for API errors
 * @param error - Error object from API call
 * @param defaultMessage - Default error message
 */
export const handleApiError = (error: any, defaultMessage: string = 'An error occurred') => {
  const message = error.response?.data?.message || error.message || defaultMessage;
  toast.error(message);
};

/**
 * Shows success toast
 * @param message - Success message
 */
export const showSuccess = (message: string) => {
  toast.success(message);
};

/**
 * Shows error toast
 * @param message - Error message
 */
export const showError = (message: string) => {
  toast.error(message);
};

/**
 * Shows info toast
 * @param message - Info message
 */
export const showInfo = (message: string) => {
  toast.info(message);
};

/**
 * Shows loading toast with promise
 * @param promise - Promise to track
 * @param messages - Loading, success, and error messages
 */
export const showLoadingToast = (
  promise: Promise<any>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) => {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  });
};

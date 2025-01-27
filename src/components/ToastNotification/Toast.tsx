"use client";

import { useNotifications } from '@/context/NotificationContext';
import React, { useEffect, useState } from 'react';

interface ToastProps {
  notification: {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
  };
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ notification, onClose }) => {
  const [progress, setProgress] = useState(100); // Progress starts at 100%

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onClose(); // Close the toast when progress reaches 0
          return 0;
        }
        return prev - 1; // Decrease progress by 1% every 30ms
      });
    }, 35); // Adjust the interval for smoother or faster animation

    return () => clearInterval(timer);
  }, [onClose]);

  // Define styles based on the notification type
  const typeStyles = {
    success: {
      borderColor: "border-green-600",
      bgColor: "bg-green-100",
      iconBg: "bg-green-300",
      titleColor: "text-black dark:text-white",
      textColor: "text-gray-400",
    },
    error: {
      borderColor: "border-red-600",
      bgColor: "bg-red-100",
      iconBg: "bg-red-300",
      titleColor: "text-black dark:text-white",
      textColor: "text-gray-400",
    },
    info: {
      borderColor: "border-blue-600",
      bgColor: "bg-blue-100",
      iconBg: "bg-blue-300",
      titleColor: "text-black dark:text-white",
      textColor: "text-gray-400",
    },
  };

  const { borderColor, bgColor, iconBg, titleColor, textColor } =
    typeStyles[notification.type];

  return (
    <div
      className={`fixed top-4 right-4 z-50 w-full max-w-sm rounded-[5px] border-l-8 ${borderColor} ${bgColor} px-7 py-5 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30`}
    >
      <div className="flex items-center">
        {/* Icon */}
        <div className={`mr-5 flex h-7 w-7 items-center justify-center rounded-[6px] ${iconBg}`}>
          {notification.type === "success" && (
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
          {notification.type === "error" && (
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
          {notification.type === "info" && (
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>

        {/* Content */}
        <div className="w-full">
          <h5 className={`mb-3 text-lg font-semibold ${titleColor}`}>
            {notification.type === "success" && "Success"}
            {notification.type === "error" && "Error"}
            {notification.type === "info" && "Attention Needed"}
          </h5>
          <p className={`leading-relaxed ${textColor}`}>
            {notification.message}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-black/20 dark:bg-white/70 transition-all duration-30 ease-linear"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <>
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </>
  );
};
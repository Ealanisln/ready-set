// src/app/api/contex/ToastContext.tsx
"use client";

import { Toaster } from "react-hot-toast";

const ToasterContext = () => {
  return (
    <Toaster
      position="top-center"
      gutter={8}
      toastOptions={{
        duration: 4000,
        success: {
          style: {
            background: '#4BB543',
            color: '#fff',
          },
        },
        error: {
          style: {
            background: '#FF4444',
            color: '#fff',
          },
        },
      }}
      containerStyle={{
        top: 40,
        bottom: 40,
        right: 40,
        left: 40,
      }}
    />
  );
};

export default ToasterContext;
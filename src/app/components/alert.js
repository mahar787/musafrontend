"use client";
import { useState, useEffect } from "react";

const Alert = ({ message }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!visible) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999]">
      <div className="bg-black text-white px-6 py-3 rounded-lg shadow-lg text-center animate-fadeInOut">
        {message}
      </div>
    </div>
  );
};

export default Alert;

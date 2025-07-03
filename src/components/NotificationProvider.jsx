import React, { createContext, useState } from 'react';

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success', autoDismiss: true });

  const showNotification = (opts) => {
    setNotification({
      show: true,
      message: opts.message,
      type: opts.type || 'success',
      autoDismiss: opts.autoDismiss !== undefined ? opts.autoDismiss : true,
      duration: opts.duration || 3000,
    });
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        autoDismiss={notification.autoDismiss}
        duration={notification.duration}
        onClose={() => setNotification(n => ({ ...n, show: false }))}
      />
      {children}
    </NotificationContext.Provider>
  );
}

// Notification component (inline)
function Notification({ show, message, type = 'success', autoDismiss = true, duration = 3000, onClose }) {
  React.useEffect(() => {
    if (show && autoDismiss) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, autoDismiss, duration, onClose]);

  if (!show) return null;

  // Tailwind color classes
  const color = type === 'success' ? 'bg-teal-400 border-teal-400' : 'bg-red-400 border-red-400';
  const icon = type === 'success' ? (
    // Checkmark icon for success
    <svg className="mr-2 text-lg rounded select-none" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="10" fill="#fff" />
      <path d="M6 10.5L9 13.5L14 8.5" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    // Exclamation icon for error
    <svg className="mr-2 text-lg rounded select-none" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="10" fill="#fff" />
      <path d="M10 6V11" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="14" r="1" fill="#F87171" />
    </svg>
  );

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-full w-80 rounded border shadow-sm pointer-events-auto bg-clip-padding ${color} animate-fade-in overflow-hidden z-[100]`}>
      <div className="flex items-center px-3 py-2 text-gray-500 rounded-t bg-clip-padding">
        {icon}
        <span className="mr-auto text-white">{type === 'success' ? 'Success' : 'Error'}</span>
        <button type="button" className="box-content p-1 ml-3 -mr-1 text-white rounded opacity-90 hover:opacity-100" onClick={onClose} aria-label="Close notification">
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="#fff" viewBox="0 0 256 256">
            <rect width="256" height="256" fill="none"></rect>
            <line x1="200" y1="56" x2="56" y2="200" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24" fill="none"></line>
            <line x1="200" y1="200" x2="56" y2="56" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24" fill="none"></line>
          </svg>
        </button>
      </div>
      <div className="p-3 bg-white text-gray-800">{message}</div>
    </div>
  );
} 
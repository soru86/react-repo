import React from 'react';

export interface ThemeWrapperProps {
  theme?: 'light' | 'dark';
  children: React.ReactNode;
}

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ theme = 'light', children }) => {
  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={theme === 'dark' ? 'dark bg-gray-900 min-h-screen p-4' : 'bg-white min-h-screen p-4'}>
      {children}
    </div>
  );
};

export default ThemeWrapper;


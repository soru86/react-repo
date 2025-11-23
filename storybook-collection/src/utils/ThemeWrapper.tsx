import React from 'react';

export interface ThemeWrapperProps {
  theme?: 'light' | 'dark';
  children: React.ReactNode;
}

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ theme = 'light', children }) => {
  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      // Set background on body and html to ensure full coverage
      const bgColor = '#111827'; // bg-gray-900
      document.body.style.backgroundColor = bgColor;
      document.body.style.color = '#f9fafb'; // text-gray-50
      document.documentElement.style.backgroundColor = bgColor;
      
      // Also set on the storybook root and canvas if they exist
      const sbRoot = document.getElementById('storybook-root');
      if (sbRoot) {
        sbRoot.style.backgroundColor = bgColor;
      }
      
      // Find and update Storybook canvas element
      const canvas = document.querySelector('[data-is-story="true"]') as HTMLElement;
      if (canvas) {
        canvas.style.backgroundColor = bgColor;
      }
      
      // Update any parent containers
      const storyContainer = document.querySelector('.os-host') as HTMLElement;
      if (storyContainer) {
        storyContainer.style.backgroundColor = bgColor;
      }
    } else {
      document.documentElement.classList.remove('dark');
      const bgColor = '#ffffff';
      document.body.style.backgroundColor = bgColor;
      document.body.style.color = '';
      document.documentElement.style.backgroundColor = bgColor;
      
      const sbRoot = document.getElementById('storybook-root');
      if (sbRoot) {
        sbRoot.style.backgroundColor = bgColor;
      }
      
      const canvas = document.querySelector('[data-is-story="true"]') as HTMLElement;
      if (canvas) {
        canvas.style.backgroundColor = bgColor;
      }
      
      const storyContainer = document.querySelector('.os-host') as HTMLElement;
      if (storyContainer) {
        storyContainer.style.backgroundColor = bgColor;
      }
    }
    
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
      document.documentElement.style.backgroundColor = '';
      
      const sbRoot = document.getElementById('storybook-root');
      if (sbRoot) {
        sbRoot.style.backgroundColor = '';
      }
      
      const canvas = document.querySelector('[data-is-story="true"]') as HTMLElement;
      if (canvas) {
        canvas.style.backgroundColor = '';
      }
      
      const storyContainer = document.querySelector('.os-host') as HTMLElement;
      if (storyContainer) {
        storyContainer.style.backgroundColor = '';
      }
    };
  }, [theme]);

  return (
    <div 
      className={theme === 'dark' ? 'dark bg-gray-900' : 'bg-white'}
      style={{ 
        minHeight: '100vh', 
        width: '100%',
        position: 'relative'
      }}
    >
      {children}
    </div>
  );
};

export default ThemeWrapper;


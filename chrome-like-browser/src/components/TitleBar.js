import React from 'react';
import './TitleBar.css';

const { ipcRenderer } = window.require ? window.require('electron') : {};

const TitleBar = () => {
  const handleMinimize = () => {
    if (ipcRenderer) ipcRenderer.send('minimize-window');
  };

  const handleMaximize = () => {
    if (ipcRenderer) ipcRenderer.send('maximize-window');
  };

  const handleClose = () => {
    if (ipcRenderer) ipcRenderer.send('close-window');
  };

  // Only show title bar controls if Electron is available
  if (!ipcRenderer) {
    return null;
  }

  return (
    <div className="title-bar">
      <div className="title-bar-drag-region">
        <div className="title-bar-title">Chrome-like Browser</div>
      </div>
      <div className="title-bar-controls">
        <button className="title-bar-button minimize" onClick={handleMinimize}>
          <span>−</span>
        </button>
        <button className="title-bar-button maximize" onClick={handleMaximize}>
          <span>□</span>
        </button>
        <button className="title-bar-button close" onClick={handleClose}>
          <span>×</span>
        </button>
      </div>
    </div>
  );
};

export default TitleBar;





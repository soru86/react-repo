import React from 'react';
import './TabBar.css';

const TabBar = ({ tabs, activeTabId, onTabClick, onTabClose, onNewTab }) => {
  return (
    <div className="tab-bar">
      <div className="tabs-container">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`tab ${tab.id === activeTabId ? 'active' : ''}`}
            onClick={() => onTabClick(tab.id)}
          >
            <div className="tab-content">
              {tab.favicon && (
                <img src={tab.favicon} alt="" className="tab-favicon" />
              )}
              <span className="tab-title">{tab.title}</span>
            </div>
            <button
              className="tab-close"
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab.id);
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button className="new-tab-button" onClick={onNewTab} title="New Tab">
        +
      </button>
    </div>
  );
};

export default TabBar;





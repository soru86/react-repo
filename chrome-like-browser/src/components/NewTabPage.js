import React from 'react';
import './NewTabPage.css';

const NewTabPage = ({ onNavigate, bookmarks, history }) => {
  const popularSites = [
    { name: 'Google', url: 'https://www.google.com', icon: '🔍' },
    { name: 'YouTube', url: 'https://www.youtube.com', icon: '▶️' },
    { name: 'GitHub', url: 'https://www.github.com', icon: '💻' },
    { name: 'Wikipedia', url: 'https://www.wikipedia.org', icon: '📚' },
    { name: 'Reddit', url: 'https://www.reddit.com', icon: '💬' },
    { name: 'Twitter', url: 'https://www.twitter.com', icon: '🐦' },
  ];

  const recentHistory = history.slice(0, 8);
  const recentBookmarks = bookmarks.slice(0, 8);

  return (
    <div className="new-tab-page">
      <div className="new-tab-content">
        <div className="search-section">
          <div className="browser-logo">🌐</div>
          <h1 className="browser-title">Chrome-like Browser</h1>
          <div className="search-box-container">
            <input
              type="text"
              className="search-box"
              placeholder="Search Google or type a URL"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onNavigate(e.target.value);
                }
              }}
            />
          </div>
        </div>

        {recentBookmarks.length > 0 && (
          <div className="section">
            <h2 className="section-title">Bookmarks</h2>
            <div className="sites-grid">
              {recentBookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="site-card"
                  onClick={() => onNavigate(bookmark.url)}
                >
                  <div className="site-icon">⭐</div>
                  <div className="site-name">{bookmark.title}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {recentHistory.length > 0 && (
          <div className="section">
            <h2 className="section-title">Recently Visited</h2>
            <div className="sites-grid">
              {recentHistory.map((item, index) => (
                <div
                  key={index}
                  className="site-card"
                  onClick={() => onNavigate(item.url)}
                >
                  <div className="site-icon">🕐</div>
                  <div className="site-name">{item.title || item.url}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="section">
          <h2 className="section-title">Popular Sites</h2>
          <div className="sites-grid">
            {popularSites.map((site) => (
              <div
                key={site.url}
                className="site-card"
                onClick={() => onNavigate(site.url)}
              >
                <div className="site-icon">{site.icon}</div>
                <div className="site-name">{site.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTabPage;





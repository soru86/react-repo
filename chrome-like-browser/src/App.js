import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import TitleBar from './components/TitleBar';
import TabBar from './components/TabBar';
import AddressBar from './components/AddressBar';
import WebView from './components/WebView';

function App() {
  const [tabs, setTabs] = useState([
    { id: 1, title: 'New Tab', url: 'about:blank', favicon: null, active: true }
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [bookmarks, setBookmarks] = useState([]);
  const [history, setHistory] = useState([]);
  const webviewRefs = useRef({});

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  const addTab = (url = 'about:blank') => {
    const newTab = {
      id: Date.now(),
      title: 'New Tab',
      url: url,
      favicon: null,
      active: false
    };
    setTabs(prevTabs => prevTabs.map(tab => ({ ...tab, active: false })).concat(newTab));
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId) => {
    if (tabs.length === 1) {
      // If last tab, create a new one
      addTab();
      return;
    }
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    if (tabId === activeTabId) {
      const index = tabs.findIndex(tab => tab.id === tabId);
      const newActiveIndex = index > 0 ? index - 1 : 0;
      setActiveTabId(newTabs[newActiveIndex].id);
    }
    setTabs(newTabs);
  };

  const switchTab = (tabId) => {
    setTabs(prevTabs => prevTabs.map(tab => ({ ...tab, active: tab.id === tabId })));
    setActiveTabId(tabId);
  };

  const updateTab = (tabId, updates) => {
    setTabs(prevTabs => prevTabs.map(tab => 
      tab.id === tabId ? { ...tab, ...updates } : tab
    ));
  };

  const navigateTo = (url) => {
    if (!url) return;
    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('about:')) {
      // Check if it's a domain or search query
      if (url.includes('.') && !url.includes(' ')) {
        finalUrl = 'https://' + url;
      } else {
        finalUrl = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      }
    }
    updateTab(activeTabId, { url: finalUrl });
    addToHistory(finalUrl, activeTab?.title);
  };

  const addToHistory = (url, title) => {
    setHistory(prev => [{ url, title: title || url, timestamp: Date.now() }, ...prev].slice(0, 100));
  };

  const addBookmark = (url, title) => {
    setBookmarks(prev => [...prev, { url, title, id: Date.now() }]);
  };

  const removeBookmark = (id) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
  };

  return (
    <div className="App">
      <TitleBar />
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onTabClick={switchTab}
        onTabClose={closeTab}
        onNewTab={() => addTab()}
      />
      <AddressBar
        url={activeTab?.url || ''}
        onNavigate={navigateTo}
        onBookmark={() => activeTab && addBookmark(activeTab.url, activeTab.title)}
        isBookmarked={bookmarks.some(b => b.url === activeTab?.url)}
        onRemoveBookmark={() => {
          const bookmark = bookmarks.find(b => b.url === activeTab?.url);
          if (bookmark) removeBookmark(bookmark.id);
        }}
        bookmarks={bookmarks}
        history={history}
        onBack={() => {
          const webview = webviewRefs.current[activeTabId];
          if (webview) webview.goBack();
        }}
        onForward={() => {
          const webview = webviewRefs.current[activeTabId];
          if (webview) webview.goForward();
        }}
        onRefresh={() => {
          const webview = webviewRefs.current[activeTabId];
          if (webview) webview.reload();
        }}
      />
      <WebView
        ref={(ref) => {
          if (ref) webviewRefs.current[activeTabId] = ref;
        }}
        key={activeTabId}
        url={activeTab?.url || 'about:blank'}
        onTitleChange={(title) => updateTab(activeTabId, { title })}
        onFaviconChange={(favicon) => updateTab(activeTabId, { favicon })}
        onUrlChange={(url) => {
          updateTab(activeTabId, { url });
          const tab = tabs.find(t => t.id === activeTabId);
          addToHistory(url, tab?.title);
        }}
        onNavigate={navigateTo}
        bookmarks={bookmarks}
        history={history}
      />
    </div>
  );
}

export default App;


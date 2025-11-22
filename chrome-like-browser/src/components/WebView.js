import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import './WebView.css';
import NewTabPage from './NewTabPage';

const WebView = forwardRef(({ url, onTitleChange, onFaviconChange, onUrlChange, onNavigate, bookmarks, history }, ref) => {
  const webviewRef = useRef(null);

  useImperativeHandle(ref, () => ({
    goBack: () => {
      if (webviewRef.current) webviewRef.current.goBack();
    },
    goForward: () => {
      if (webviewRef.current) webviewRef.current.goForward();
    },
    reload: () => {
      if (webviewRef.current) webviewRef.current.reload();
    },
    canGoBack: () => {
      return webviewRef.current ? webviewRef.current.canGoBack() : false;
    },
    canGoForward: () => {
      return webviewRef.current ? webviewRef.current.canGoForward() : false;
    }
  }));

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return;

    const handleDidFinishLoad = () => {
      const title = webview.getTitle();
      const currentUrl = webview.getURL();
      
      if (title) onTitleChange(title);
      if (currentUrl) onUrlChange(currentUrl);
      
      // Try to get favicon
      try {
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(currentUrl).hostname}&sz=32`;
        onFaviconChange(faviconUrl);
      } catch (e) {
        // If URL parsing fails, use default
        onFaviconChange(null);
      }
    };

    const handlePageTitleUpdated = (e) => {
      if (e.title) onTitleChange(e.title);
    };

    const handleDidNavigate = (e) => {
      if (e.url) onUrlChange(e.url);
    };

    webview.addEventListener('did-finish-load', handleDidFinishLoad);
    webview.addEventListener('page-title-updated', handlePageTitleUpdated);
    webview.addEventListener('did-navigate', handleDidNavigate);

    return () => {
      webview.removeEventListener('did-finish-load', handleDidFinishLoad);
      webview.removeEventListener('page-title-updated', handlePageTitleUpdated);
      webview.removeEventListener('did-navigate', handleDidNavigate);
    };
  }, [onTitleChange, onFaviconChange, onUrlChange]);

  // Check if we're in Electron environment
  const isElectron = window.require && window.require('electron');

  // Show new tab page for about:blank
  if (url === 'about:blank' || url === '') {
    return (
      <div className="webview-container">
        <NewTabPage 
          onNavigate={onNavigate || (() => {})} 
          bookmarks={bookmarks || []}
          history={history || []}
        />
      </div>
    );
  }

  if (!isElectron) {
    // Fallback for browser environment (development)
    return (
      <div className="webview-container">
        <div className="webview-fallback">
          <div className="fallback-content">
            <h2>Chrome-like Browser</h2>
            <p>This application requires Electron to run.</p>
            <p>Please run: <code>npm run electron-dev</code></p>
            <div className="url-display">
              <strong>URL:</strong> {url}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="webview-container">
      <webview
        ref={webviewRef}
        src={url}
        className="webview"
        allowpopups="true"
        webpreferences="nodeIntegration=no, contextIsolation=yes"
      />
    </div>
  );
});

WebView.displayName = 'WebView';

export default WebView;


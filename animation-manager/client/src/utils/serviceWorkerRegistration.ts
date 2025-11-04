// Service Worker Registration and Management

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.log('[SW] Service workers are not supported');
    return null;
  }

  try {
    // VitePWA will handle registration, but we can also manually register
    // if needed for our custom upload functionality
    const registration = await navigator.serviceWorker.getRegistration();
    
    if (!registration) {
      // Fallback: manually register if VitePWA hasn't registered yet
      const newRegistration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      console.log('[SW] Manually registered service worker:', newRegistration.scope);
      return newRegistration;
    }
    
    console.log('[SW] Service Worker already registered:', registration.scope);

    // Update auth token in cache when it changes
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key: string, value: string) {
      originalSetItem.call(this, key, value);
      if (key === 'token') {
        updateAuthTokenInCache(value);
      }
    };

    // Initial token sync
    const token = localStorage.getItem('token');
    if (token) {
      updateAuthTokenInCache(token);
    }

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[SW] New service worker available');
          } else if (newWorker.state === 'activated') {
            console.log('[SW] Service worker activated');
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error('[SW] Service worker registration failed:', error);
    return null;
  }
}

async function updateAuthTokenInCache(token: string) {
  try {
    const cache = await caches.open('animation-manager-v1');
    await cache.put('/auth-token', new Response(token, {
      headers: { 'Content-Type': 'text/plain' },
    }));
    console.log('[SW] Auth token updated in cache');
  } catch (error) {
    console.error('[SW] Error updating auth token:', error);
  }
}

export async function unregisterServiceWorker(): Promise<void> {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    await registration.unregister();
    console.log('[SW] Service worker unregistered');
  }
}


// Custom Service Worker for Offline Upload Support
// This file will be processed by VitePWA injectManifest strategy
// VitePWA will bundle workbox and inject __WB_MANIFEST during build

// Import workbox precaching - VitePWA will bundle this during build
import { precacheAndRoute } from 'workbox-precaching';

// Precache all assets - VitePWA will inject the manifest array
precacheAndRoute(self.__WB_MANIFEST || []);

const CACHE_NAME = 'animation-manager-v1';
const DB_NAME = 'AnimationManagerDB';
const STORE_NAME = 'pendingUploads';

// Install event
self.addEventListener('install', (event) => {
  console.log('[SW] Service Worker installing...');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

// Background Sync event for retrying uploads
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-upload') {
    console.log('[SW] Background sync triggered for upload');
    event.waitUntil(processUploadQueue());
  }
});

// Message event for communication with client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'QUEUE_UPLOAD') {
    event.waitUntil(processUploadQueue());
  }
});

// Process upload queue
async function processUploadQueue() {
  try {
    const uploads = await getPendingUploads();
    
    if (uploads.length === 0) {
      console.log('[SW] No pending uploads');
      return;
    }

    console.log(`[SW] Processing ${uploads.length} pending upload(s)`);

    for (const upload of uploads) {
      try {
        await processUpload(upload);
      } catch (error) {
        console.error(`[SW] Failed to process upload ${upload.id}:`, error);
        await updateRetryCount(upload.id, upload.retryCount + 1);
      }
    }
  } catch (error) {
    console.error('[SW] Error processing upload queue:', error);
  }
}

// Process a single upload
async function processUpload(upload) {
  const token = await getAuthToken();
  
  if (!token) {
    console.log('[SW] No auth token available');
    throw new Error('No authentication token');
  }

  // Convert ArrayBuffer back to File/Blob
  const blob = new Blob([upload.fileData], { type: upload.fileType });
  const file = new File([blob], upload.fileName, { type: upload.fileType });
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', upload.title);
  if (upload.description) formData.append('description', upload.description);
  if (upload.tags) formData.append('tags', upload.tags);
  formData.append('is_public', String(upload.is_public));

  const response = await fetch('/api/animations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
  }

  await removeFromQueue(upload.id);
  console.log(`[SW] Successfully uploaded ${upload.id}`);
  
  // Notify clients
  const clients = await self.clients.matchAll();
  clients.forEach((client) => {
    client.postMessage({
      type: 'UPLOAD_SUCCESS',
      uploadId: upload.id,
    });
  });
}

// Helper functions for IndexedDB
async function getPendingUploads() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onsuccess = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        resolve([]);
        return;
      }
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result || []);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onerror = () => reject(request.error);
    
    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' });
        database.createObjectStore(STORE_NAME).createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

async function removeFromQueue(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onsuccess = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        resolve();
        return;
      }
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
}

async function updateRetryCount(id, retryCount) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onsuccess = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        resolve();
        return;
      }
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const upload = getRequest.result;
        if (upload) {
          upload.retryCount = retryCount;
          const putRequest = store.put(upload);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve();
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
}

async function getAuthToken() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match('/auth-token');
    if (response) {
      return await response.text();
    }
  } catch (error) {
    console.error('[SW] Error getting auth token:', error);
  }
  return null;
}

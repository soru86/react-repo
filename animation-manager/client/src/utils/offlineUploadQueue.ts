// Offline Upload Queue Manager using IndexedDB

interface PendingUpload {
  id: string;
  fileName: string;
  fileType: string;
  fileData: ArrayBuffer;
  fileSize: number;
  title: string;
  description: string;
  tags: string;
  is_public: boolean;
  timestamp: number;
  retryCount: number;
}

const DB_NAME = 'AnimationManagerDB';
const DB_VERSION = 1;
const STORE_NAME = 'pendingUploads';

let db: IDBDatabase | null = null;

// Initialize IndexedDB
export async function initDB(): Promise<IDBDatabase> {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = database.createObjectStore(STORE_NAME, { keyPath: 'id' });
        objectStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

// Add upload to queue
export async function addToQueue(
  file: File,
  title: string,
  description: string,
  tags: string,
  is_public: boolean
): Promise<string> {
  const database = await initDB();
  const id = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Convert File to ArrayBuffer for storage in IndexedDB
  const fileData = await file.arrayBuffer();
  
  const upload: PendingUpload = {
    id,
    fileName: file.name,
    fileType: file.type,
    fileData,
    fileSize: file.size,
    title,
    description,
    tags,
    is_public,
    timestamp: Date.now(),
    retryCount: 0,
  };

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(upload);

    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(request.error);
  });
}

// Get all pending uploads
export async function getPendingUploads(): Promise<PendingUpload[]> {
  const database = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Remove upload from queue
export async function removeFromQueue(id: string): Promise<void> {
  const database = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Update retry count
export async function updateRetryCount(id: string, retryCount: number): Promise<void> {
  const database = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
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
  });
}

// Check if online
export function isOnline(): boolean {
  return navigator.onLine;
}

// Listen for online/offline events
export function onOnlineStatusChange(callback: (online: boolean) => void): () => void {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}


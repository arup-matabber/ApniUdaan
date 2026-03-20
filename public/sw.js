const STATIC_CACHE = 'career-advisor-static-v1';
const DYNAMIC_CACHE = 'career-advisor-dynamic-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/offline.html'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/quiz/,
  /\/api\/colleges/,
  /\/api\/content/,
  /\/api\/streams/,
  /\/api\/degrees/
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((err) => {
        console.error('Service Worker: Failed to cache static assets', err);
      })
  );
  
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
  
  self.clients.claim();
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }
  
  // Handle other requests (static assets)
  event.respondWith(handleStaticRequest(request));
});

// Handle API requests with cache-first strategy for GET requests
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  // Only cache GET requests for specific endpoints
  if (request.method === 'GET' && shouldCacheApiRequest(url.pathname)) {
    try {
      // Try cache first
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        // Serve from cache and update in background
        updateCacheInBackground(request);
        return cachedResponse;
      }
      
      // Fetch from network and cache
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        const cache = await caches.open(DYNAMIC_CACHE);
        // Only cache HTTP/HTTPS requests, not chrome-extension URLs
        if (request.url.startsWith('http')) {
          cache.put(request, networkResponse.clone());
        }
      }
      return networkResponse;
      
    } catch (err) {
      // Return cached version if available
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Return offline response for critical endpoints
      return createOfflineApiResponse(url.pathname);
    }
  }
  
  // For non-GET requests, always try network first
  try {
    return await fetch(request);
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Network unavailable', offline: true }),
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    // Try network first for navigation
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (err) {
    // Serve cached page or offline page
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Serve offline page
    return caches.match('/offline.html');
  }
}

// Handle static asset requests
async function handleStaticRequest(request) {
  try {
    // Try cache first for static assets
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fetch from network and cache
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      // Only cache HTTP/HTTPS requests, not chrome-extension URLs
      if (request.url.startsWith('http')) {
        cache.put(request, networkResponse.clone());
      }
    }
    return networkResponse;
    
  } catch (err) {
    // Return cached version if available
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return generic offline response
    return new Response('Offline', { status: 503 });
  }
}

// Check if API request should be cached
function shouldCacheApiRequest(pathname) {
  return API_CACHE_PATTERNS.some(pattern => pattern.test(pathname));
}

// Update cache in background
async function updateCacheInBackground(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
  } catch (error) {
    console.log('Background cache update failed:', error);
  }
}

// Create offline API response
function createOfflineApiResponse(pathname) {
  let offlineData = { error: 'Offline', offline: true };
  
  if (pathname.includes('/quiz')) {
    offlineData = {
      quizzes: [],
      message: 'Quizzes not available offline'
    };
  } else if (pathname.includes('/colleges')) {
    offlineData = {
      colleges: [],
      message: 'College data not available offline'
    };
  } else if (pathname.includes('/content')) {
    offlineData = {
      content: [],
      message: 'Content not available offline'
    };
  }
  
  return new Response(
    JSON.stringify(offlineData),
    { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync());
  }
});

// Handle background sync
async function handleBackgroundSync() {
  try {
    // Get pending requests from IndexedDB
    const pendingRequests = await getPendingRequests();
    
    for (const request of pendingRequests) {
      try {
        await fetch(request.url, {
          method: request.method,
          headers: request.headers,
          body: request.body
        });
        
        // Remove from pending requests
        await removePendingRequest(request.id);
        
      } catch (err) {
        console.log('Background sync failed for request:', request.id, err);
      }
    }
  } catch (error) {
    console.error('Background sync error:', error);
  }
}

// IndexedDB helpers for offline queue
async function getPendingRequests() {
  // Implementation would use IndexedDB to store pending requests
  return [];
}

async function removePendingRequest(id) {
  // Implementation would remove request from IndexedDB
  console.log('Removing pending request:', id);
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icons/view-action.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/dismiss-action.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    const urlToOpen = event.notification.data.url || '/';
    
    event.waitUntil(
      self.clients.matchAll({ type: 'window' })
        .then((clientList) => {
          // Check if app is already open
          for (const client of clientList) {
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }
          
          // Open new window
          if (self.clients.openWindow) {
            return self.clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// Message handling for cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_UPDATE') {
    event.waitUntil(updateSpecificCache(event.data.url));
  }
});

// Update specific cache entry
async function updateSpecificCache(url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      await cache.put(url, response);
    }
  } catch (error) {
    console.error('Cache update failed:', error);
  }
}

// This is a minimal service worker for supporting notifications on Chrome mobile

const CACHE_NAME = 'taskbell-cache-v2';
const BASE_URL = self.location.pathname.replace('sw.js', '');

// Install event - cache basic resources with relative paths
self.addEventListener('install', event => {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        BASE_URL,
        BASE_URL + 'index.html',
        BASE_URL + 'styles.css',
        BASE_URL + 'script.js',
        BASE_URL + 'animations.css',
        BASE_URL + 'favicon.svg'
      ])
      .catch(error => {
        console.error('Cache addAll error:', error);
      });
    })
  );
  
  // Force activation without waiting for reload
  self.skipWaiting();
});

// Activate event - clean up old caches and claim clients immediately
self.addEventListener('activate', event => {
  console.log('Service Worker activating.');
  event.waitUntil(
    Promise.all([
      // Clean old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.filter(cacheName => {
            return cacheName !== CACHE_NAME;
          }).map(cacheName => {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }),
      // Take control of all clients immediately
      self.clients.claim()
    ])
  );
});

// Fetch event - respond with cached resources when available
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Return the cached response if found
      if (response) {
        return response;
      }
      // Otherwise, fetch from network
      return fetch(event.request).catch(error => {
        console.error('Fetch error:', event.request.url, error);
        // You could return a fallback response here
      });
    })
  );
});

// Push notification event handler with enhanced error handling
self.addEventListener('push', event => {
  console.log('Push notification received.');
  
  // Default notification data
  let notificationData = {
    title: 'TASKBELL Notification',
    body: 'You have a task to complete!',
    icon: './favicon.svg',  // Using relative path
    tag: 'taskbell-notification',
    badge: './favicon.svg',  // Using relative path
    vibrate: [200, 100, 200],
    data: {
      url: self.location.origin + BASE_URL
    }
  };
  
  // Try to parse data from the push event
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = Object.assign({}, notificationData, data);
    } catch (e) {
      console.error('Error parsing push data:', e);
    }
  }
  
  // Show the notification with better error handling
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      vibrate: notificationData.vibrate,
      tag: notificationData.tag,
      renotify: true,
      requireInteraction: true,
      data: notificationData.data
    })
    .catch(error => {
      console.error('Error showing notification:', error);
    })
  );
});

// Notification click event handler
self.addEventListener('notificationclick', event => {
  console.log('Notification clicked.');
  
  event.notification.close();
  
  // Try to open the main app when notification is clicked
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // Check if there is already a window/tab open with the target URL
      for (const client of windowClients) {
        if (client.url === self.location.origin + BASE_URL && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window/tab is open, open one
      if (clients.openWindow) {
        return clients.openWindow(self.location.origin + BASE_URL);
      }
    })
    .catch(error => {
      console.error('Error handling notification click:', error);
    })
  );
});

// Listen for messages from the main page
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
}); 
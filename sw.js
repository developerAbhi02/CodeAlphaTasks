// This is a minimal service worker for supporting notifications on Chrome mobile

const CACHE_NAME = 'taskbell-cache-v1';

// Install event - cache basic resources
self.addEventListener('install', event => {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/script.js',
        '/animations.css',
        '/favicon.svg'
      ]);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating.');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
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
      return fetch(event.request);
    })
  );
});

// Push notification event handler
self.addEventListener('push', event => {
  console.log('Push notification received.');
  
  // Default notification data
  let notificationData = {
    title: 'TASKBELL Notification',
    body: 'You have a task to complete!',
    icon: '/favicon.svg',
    tag: 'taskbell-notification',
    badge: '/favicon.svg',
    vibrate: [200, 100, 200],
    data: {
      url: self.location.origin
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
  
  // Show the notification
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      vibrate: notificationData.vibrate,
      tag: notificationData.tag,
      data: notificationData.data
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
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window/tab is open, open one
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
}); 
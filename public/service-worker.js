self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'New Update from TajaShutki';
  const options = {
    body: data.body || 'You have a new notification!',
    icon: '/TajaShutki.png',
    badge: '/TajaShutki.png',
    data: {
      url: data.url || '/'
    }
  };

  const badgePromise = 'setAppBadge' in self.navigator ? self.navigator.setAppBadge() : Promise.resolve();

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, options),
      badgePromise
    ])
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const clearBadgePromise = 'clearAppBadge' in self.navigator ? self.navigator.clearAppBadge() : Promise.resolve();

  event.waitUntil(
    Promise.all([
      clients.openWindow(event.notification.data.url),
      clearBadgePromise
    ])
  );
});

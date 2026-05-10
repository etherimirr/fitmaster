/**
 * Local Notifications shim — when the rest timer fires `notify(title, body)`,
 * routes through Capacitor LocalNotifications on native, falls back to web Notification API.
 */
(function () {
  const isNative = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());

  // Override the existing notify() function once the native bridge is ready
  window.__notifyNative = async function (title, body) {
    if (!isNative) return false;
    try {
      const { LocalNotifications } = window.Capacitor.Plugins;
      const perm = await LocalNotifications.checkPermissions();
      if (perm.display !== 'granted') {
        const r = await LocalNotifications.requestPermissions();
        if (r.display !== 'granted') return false;
      }
      await LocalNotifications.schedule({
        notifications: [{
          id: Date.now() % 100000,
          title,
          body,
          sound: 'default',
          schedule: { at: new Date(Date.now() + 100) },
        }]
      });
      return true;
    } catch (e) {
      console.error('[FitMaster] LocalNotification failed', e);
      return false;
    }
  };

  // Hook: replace the original notify function. The original lives in index.html.
  // We patch via a tiny wrapper: when native, prefer native; else original behavior runs.
  const origNotify = window.notify;
  window.notify = function (title, body) {
    if (isNative) {
      window.__notifyNative(title, body);
    } else if (typeof origNotify === 'function') {
      origNotify(title, body);
    } else if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  };
})();

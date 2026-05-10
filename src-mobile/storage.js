/**
 * Storage shim — uses Capacitor Preferences when available (native iOS app),
 * falls back to localStorage for web/dev mode.
 *
 * The existing app calls localStorage.getItem/setItem/removeItem synchronously.
 * We monkey-patch these to also write through to Preferences (async, fire-and-forget),
 * and we hydrate localStorage from Preferences on app boot.
 */
(function () {
  const KEY = 'fitmaster.v1';
  const isNative = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());

  if (!isNative) {
    // Web/dev mode → no-op, use real localStorage
    console.log('[FitMaster] Web mode, using localStorage');
    window.__fitmasterStorageReady = Promise.resolve();
    return;
  }

  console.log('[FitMaster] Native iOS mode, hydrating from Capacitor Preferences');

  // Hydrate localStorage from Preferences before app init
  window.__fitmasterStorageReady = (async () => {
    try {
      const { Preferences } = window.Capacitor.Plugins;
      const { value } = await Preferences.get({ key: KEY });
      if (value) {
        // Pre-populate localStorage so the existing sync code path works
        localStorage.setItem(KEY, value);
        console.log('[FitMaster] Hydrated', value.length, 'bytes from Preferences');
      } else {
        console.log('[FitMaster] No previous data in Preferences');
      }

      // Patch setItem to also persist to Preferences (write-through)
      const origSetItem = localStorage.setItem.bind(localStorage);
      localStorage.setItem = function (k, v) {
        origSetItem(k, v);
        if (k === KEY) {
          Preferences.set({ key: KEY, value: v }).catch(e =>
            console.error('[FitMaster] Preferences write failed', e));
        }
      };

      const origRemoveItem = localStorage.removeItem.bind(localStorage);
      localStorage.removeItem = function (k) {
        origRemoveItem(k);
        if (k === KEY) {
          Preferences.remove({ key: KEY }).catch(() => {});
        }
      };
    } catch (e) {
      console.error('[FitMaster] Preferences hydration failed, falling back to localStorage', e);
    }
  })();
})();

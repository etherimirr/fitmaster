/**
 * Camera shim — when running natively, intercepts <input type="file" accept="image/*">
 * clicks and uses the native Capacitor Camera plugin instead.
 *
 * This way the existing HTML <input> elements work both on Web and iOS without changes.
 */
(function () {
  const isNative = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  if (!isNative) return;

  console.log('[FitMaster] Native camera shim active');

  // Intercept clicks on file inputs
  document.addEventListener('click', async (e) => {
    const input = e.target.closest('input[type="file"]');
    if (!input || !input.accept || !input.accept.includes('image')) return;
    e.preventDefault();
    e.stopPropagation();

    try {
      const { Camera, CameraSource, CameraResultType } = window.Capacitor.Plugins.Camera || window;
      const cameraPlugin = window.Capacitor.Plugins.Camera;
      // Show action sheet: take photo or pick from library
      const photo = await cameraPlugin.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: 'dataUrl',     // returns data:image/...;base64,...
        source: 'Prompt',          // user picks Camera or Photos
        width: 1024,
      });

      // Build a synthetic File-like object the existing JS expects
      const dataUrl = photo.dataUrl;
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `photo-${Date.now()}.jpg`, { type: blob.type });

      // Inject into input.files via DataTransfer
      const dt = new DataTransfer();
      // If multiple selection enabled, we still pass one (native picker = one at a time)
      dt.items.add(file);
      input.files = dt.files;

      // Fire change event so existing handlers run
      input.dispatchEvent(new Event('change', { bubbles: true }));
    } catch (err) {
      if (err && err.message && err.message.includes('cancelled')) return;
      console.error('[FitMaster] Camera error', err);
      alert('相机/相册访问失败：' + (err.message || err));
    }
  }, true);
})();

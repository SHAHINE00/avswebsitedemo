// Mobile Testing and Validation Utilities

export interface MobileTestResult {
  test: string;
  passed: boolean;
  message: string;
  severity: 'info' | 'warning' | 'error';
}

export const runMobileCompatibilityTests = (): MobileTestResult[] => {
  const results: MobileTestResult[] = [];

  // Test 1: Service Worker Support
  results.push({
    test: 'Service Worker Support',
    passed: 'serviceWorker' in navigator,
    message: 'serviceWorker' in navigator 
      ? 'Service Worker is supported' 
      : 'Service Worker not supported - offline features unavailable',
    severity: 'serviceWorker' in navigator ? 'info' : 'warning'
  });

  // Test 2: Touch Support
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  results.push({
    test: 'Touch Support',
    passed: hasTouch,
    message: hasTouch 
      ? 'Touch events are supported' 
      : 'Touch events not detected - may not be a touch device',
    severity: 'info'
  });

  // Test 3: Viewport Meta Tag
  const viewport = document.querySelector('meta[name="viewport"]');
  results.push({
    test: 'Viewport Meta Tag',
    passed: !!viewport,
    message: viewport 
      ? 'Viewport meta tag is present' 
      : 'Viewport meta tag missing - mobile scaling may be incorrect',
    severity: viewport ? 'info' : 'error'
  });

  // Test 4: PWA Manifest
  const manifest = document.querySelector('link[rel="manifest"]');
  results.push({
    test: 'PWA Manifest',
    passed: !!manifest,
    message: manifest 
      ? 'PWA manifest is linked' 
      : 'PWA manifest missing - app install not available',
    severity: manifest ? 'info' : 'warning'
  });

  // Test 5: Cache API Support
  results.push({
    test: 'Cache API Support',
    passed: 'caches' in window,
    message: 'caches' in window 
      ? 'Cache API is supported' 
      : 'Cache API not supported - offline caching unavailable',
    severity: 'caches' in window ? 'info' : 'warning'
  });

  // Test 6: Modern JavaScript Features
  const hasModernJS = !!(window.fetch && window.Promise && window.Map && window.Set);
  results.push({
    test: 'Modern JavaScript Support',
    passed: hasModernJS,
    message: hasModernJS 
      ? 'Modern JavaScript features are supported' 
      : 'Some modern JavaScript features missing - compatibility issues possible',
    severity: hasModernJS ? 'info' : 'error'
  });

  // Test 7: CSS Grid and Flexbox
  let hasCSSSupport = false;
  try {
    hasCSSSupport = CSS.supports('display', 'grid') && CSS.supports('display', 'flex');
  } catch (e) {
    // CSS.supports not available
  }
  results.push({
    test: 'Modern CSS Support',
    passed: hasCSSSupport,
    message: hasCSSSupport 
      ? 'Modern CSS features (Grid, Flexbox) are supported' 
      : 'Modern CSS features may not be supported - layout issues possible',
    severity: hasCSSSupport ? 'info' : 'warning'
  });

  // Test 8: Network Connection
  results.push({
    test: 'Network Connection',
    passed: navigator.onLine,
    message: navigator.onLine 
      ? 'Device is online' 
      : 'Device appears to be offline',
    severity: navigator.onLine ? 'info' : 'warning'
  });

  // Test 9: Screen Size
  const isReasonableSize = window.innerWidth >= 320 && window.innerHeight >= 568;
  results.push({
    test: 'Screen Size',
    passed: isReasonableSize,
    message: `Screen size: ${window.innerWidth}x${window.innerHeight}${isReasonableSize ? ' (adequate)' : ' (very small)'}`,
    severity: isReasonableSize ? 'info' : 'warning'
  });

  // Test 10: Performance API
  results.push({
    test: 'Performance API',
    passed: 'performance' in window && 'PerformanceObserver' in window,
    message: ('performance' in window && 'PerformanceObserver' in window)
      ? 'Performance monitoring is available' 
      : 'Performance API limited - monitoring may be reduced',
    severity: 'info'
  });

  return results;
};

export const logMobileTestResults = (): void => {
  const results = runMobileCompatibilityTests();
  
  console.group('🔧 Mobile Compatibility Test Results');
  
  results.forEach(result => {
    const icon = result.passed ? '✅' : (result.severity === 'error' ? '❌' : '⚠️');
    const method = result.severity === 'error' ? 'error' : result.severity === 'warning' ? 'warn' : 'log';
    console[method](`${icon} ${result.test}: ${result.message}`);
  });

  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  const errors = results.filter(r => !r.passed && r.severity === 'error').length;
  
  console.log(`\n📊 Summary: ${passed}/${total} tests passed${errors > 0 ? `, ${errors} critical issues` : ''}`);
  console.groupEnd();
};

export const getMobileDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  const vendor = navigator.vendor;
  
  return {
    userAgent,
    platform,
    vendor,
    language: navigator.language,
    languages: navigator.languages,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    maxTouchPoints: navigator.maxTouchPoints,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: (navigator as any).deviceMemory,
    connection: (navigator as any).connection,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio,
    colorDepth: window.screen.colorDepth,
    orientation: (window.screen as any).orientation?.type || 'unknown'
  };
};

export const debugMobileSession = (): void => {
  console.group('📱 Mobile Debug Session');
  
  // Device info
  console.log('📋 Device Information:', getMobileDeviceInfo());
  
  // Compatibility tests
  logMobileTestResults();
  
  // Current page info
  console.log('🌐 Page Information:', {
    url: window.location.href,
    title: document.title,
    readyState: document.readyState,
    referrer: document.referrer
  });

  // Performance info
  if ('performance' in window) {
    const perf = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (perf) {
      console.log('⚡ Performance Metrics:', {
        loadTime: Math.round(perf.loadEventEnd - perf.loadEventStart),
        domContentLoaded: Math.round(perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart),
        firstPaint: Math.round(perf.responseEnd - perf.fetchStart),
        transferSize: perf.transferSize
      });
    }
  }

  console.groupEnd();
};
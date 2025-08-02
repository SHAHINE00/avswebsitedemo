import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IOSFallbackLoaderProps {
  error?: string;
  onRetry?: () => void;
}

export const IOSFallbackLoader: React.FC<IOSFallbackLoaderProps> = ({ 
  error = "Loading failed", 
  onRetry 
}) => {
  const handleRefresh = () => {
    if (onRetry) {
      onRetry();
    } else {
      // Clear caches and reload
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name));
        }).finally(() => {
          (window as any).location.reload();
        });
      } else {
        (window as any).location.reload();
      }
    }
  };

  return (
    <div className="ios-fallback-loader fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="max-w-sm mx-auto text-center p-6 bg-card rounded-lg shadow-lg border">
        <div className="mb-4 flex justify-center">
          <div className="relative">
            <AlertTriangle className="h-12 w-12 text-amber-500" />
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full animate-pulse" />
          </div>
        </div>
        
        <h2 className="text-lg font-semibold mb-2 text-foreground">
          Loading Issue Detected
        </h2>
        
        <p className="text-sm text-muted-foreground mb-4">
          Your device experienced a loading issue. This sometimes happens on iOS Safari.
        </p>
        
        <div className="space-y-2">
          <Button 
            onClick={handleRefresh}
            className="w-full"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh App
          </Button>
          
          <p className="text-xs text-muted-foreground">
            This will clear temporary data and reload the app
          </p>
        </div>
      </div>
    </div>
  );
};

// Auto-mount fallback loader for iOS chunk loading errors
export const mountIOSFallbackLoader = (error?: string): void => {
  // Only mount on iOS devices
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  
  if (!isIOS) return;

  const existingLoader = document.querySelector('.ios-fallback-loader');
  if (existingLoader) return;

  const loaderElement = document.createElement('div');
  loaderElement.className = 'ios-fallback-loader';
  loaderElement.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(8px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: system-ui, -apple-system, sans-serif;
    ">
      <div style="
        max-width: 320px;
        text-align: center;
        padding: 24px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        border: 1px solid #e5e7eb;
      ">
        <div style="
          width: 48px;
          height: 48px;
          margin: 0 auto 16px;
          background: #f59e0b;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
        ">⚠</div>
        
        <h2 style="
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #111827;
        ">Loading Issue</h2>
        
        <p style="
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 20px;
          line-height: 1.4;
        ">App loading failed. This can happen on iOS Safari due to network issues.</p>
        
        <button onclick="
          if ('caches' in window) {
            caches.keys().then(names => {
              names.forEach(name => caches.delete(name));
            }).finally(() => window.location.reload());
          } else {
            window.location.reload();
          }
        " style="
          width: 100%;
          padding: 12px 16px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        " onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">
          🔄 Refresh App
        </button>
        
        <p style="
          font-size: 12px;
          color: #9ca3af;
          margin-top: 12px;
        ">This will clear cache and reload</p>
      </div>
    </div>
  `;

  document.body.appendChild(loaderElement);
  
  // Auto-remove after 30 seconds
  setTimeout(() => {
    if (document.contains(loaderElement)) {
      loaderElement.remove();
    }
  }, 30000);
};
import { useEffect } from 'react';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';

interface SecurityEnhancedWrapperProps {
  children: React.ReactNode;
}

export const SecurityEnhancedWrapper = ({ children }: SecurityEnhancedWrapperProps) => {
  const { monitorSuspiciousActivity } = useSecurityAudit();

  useEffect(() => {
    // Add security headers via meta tags
    const addSecurityHeaders = () => {
      // Content Security Policy
      const csp = document.createElement('meta');
      csp.httpEquiv = 'Content-Security-Policy';
      csp.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://nkkalmyhxtuisjdjmdew.supabase.co wss://nkkalmyhxtuisjdjmdew.supabase.co;";
      document.head.appendChild(csp);

      // X-Frame-Options
      const frameOptions = document.createElement('meta');
      frameOptions.httpEquiv = 'X-Frame-Options';
      frameOptions.content = 'DENY';
      document.head.appendChild(frameOptions);

      // X-Content-Type-Options
      const contentType = document.createElement('meta');
      contentType.httpEquiv = 'X-Content-Type-Options';
      contentType.content = 'nosniff';
      document.head.appendChild(contentType);

      // Referrer Policy
      const referrer = document.createElement('meta');
      referrer.name = 'referrer';
      referrer.content = 'strict-origin-when-cross-origin';
      document.head.appendChild(referrer);
    };

    // Monitor for suspicious activity
    const monitorSecurityEvents = () => {
      // Monitor console access attempts
      const originalConsole = window.console;
      let consoleAccessCount = 0;
      
      Object.keys(originalConsole).forEach(key => {
        if (typeof originalConsole[key as keyof Console] === 'function') {
          const originalMethod = originalConsole[key as keyof Console] as Function;
          (originalConsole as any)[key] = function(...args: any[]) {
            consoleAccessCount++;
            if (consoleAccessCount > 50) {
              monitorSuspiciousActivity(
                'anonymous',
                'excessive_console_access',
                { count: consoleAccessCount, timestamp: Date.now() }
              );
            }
            return originalMethod.apply(this, args);
          };
        }
      });

      // Monitor multiple rapid form submissions
      let formSubmissionCount = 0;
      const resetSubmissionCount = () => { formSubmissionCount = 0; };
      
      document.addEventListener('submit', () => {
        formSubmissionCount++;
        if (formSubmissionCount > 10) {
          monitorSuspiciousActivity(
            'anonymous',
            'rapid_form_submissions',
            { count: formSubmissionCount, timestamp: Date.now() }
          );
        }
        setTimeout(resetSubmissionCount, 60000); // Reset after 1 minute
      });

      // Monitor for suspicious URL patterns
      const monitorNavigation = () => {
        const suspiciousPatterns = [
          /\.\.\//g, // Directory traversal
          /<script/gi, // XSS attempts
          /union\s+select/gi, // SQL injection
          /javascript:/gi, // JavaScript injection
        ];
        
        const currentUrl = window.location.href;
        suspiciousPatterns.forEach(pattern => {
          if (pattern.test(currentUrl)) {
            monitorSuspiciousActivity(
              'anonymous',
              'suspicious_url_pattern',
              { url: currentUrl, pattern: pattern.source, timestamp: Date.now() }
            );
          }
        });
      };

      monitorNavigation();
      window.addEventListener('popstate', monitorNavigation);
    };

    addSecurityHeaders();
    monitorSecurityEvents();

    // Cleanup function
    return () => {
      window.removeEventListener('popstate', () => {});
    };
  }, [monitorSuspiciousActivity]);

  return <>{children}</>;
};
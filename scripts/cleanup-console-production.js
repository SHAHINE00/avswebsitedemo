#!/usr/bin/env node

/**
 * Production Console Cleanup Script
 * Systematically replaces console statements with logger calls for production safety
 */

const fs = require('fs');
const path = require('path');

// Files to process - comprehensive list
const filesToProcess = [
  'src/App.tsx',
  'src/components/EnhancedMultiStepForm.tsx',
  'src/components/MultiStepRegistrationForm.tsx',
  'src/components/SEOHead.tsx',
  'src/hooks/useAdminActivityLogs.tsx',
  'src/hooks/useAdminCourses.tsx',
  'src/hooks/useAdminEnrollments.tsx',
  'src/hooks/useAdvancedAnalytics.tsx',
  'src/hooks/useAnalytics.tsx',
  'src/hooks/useAppointmentBooking.tsx',
  'src/hooks/useBlogManagement.tsx',
  'src/hooks/useContactForm.tsx',
  'src/hooks/useCourseContent.tsx',
  'src/hooks/useCourseInteractions.tsx',
  'src/hooks/useCourses.tsx',
  'src/hooks/useDashboardMetrics.tsx',
  'src/hooks/useEnhancedLearning.tsx',
  'src/hooks/useEnrollment.tsx',
  'src/hooks/useGamification.tsx',
  'src/hooks/useNotifications.tsx',
  'src/hooks/usePendingUsers.tsx',
  'src/hooks/useSystemHealth.tsx',
  'src/hooks/useUserProfile.tsx',
  'src/hooks/useIsIOS.ts',
  'src/components/admin/dashboard/AppointmentManagement.tsx',
  'src/components/admin/dashboard/EnhancedSectionReorderDialog.tsx',
  'src/components/admin/dashboard/SubscriberManagement.tsx',
  'src/components/admin/dashboard/SystemMonitoring.tsx',
  'src/components/admin/dashboard/user-management/UserEnrollmentDialog.tsx',
  'src/components/blog/BlogManagement.tsx',
  'src/components/admin/dashboard/CourseManagementSection.tsx',
  'src/components/admin/dashboard/UserManagementSection.tsx',
  'src/components/admin/dashboard/SecurityMonitoring.tsx',
  'src/components/admin/dashboard/EnrollmentAnalytics.tsx',
  'src/components/admin/dashboard/RealTimeAnalytics.tsx',
  'src/components/admin/dashboard/AdvancedAnalytics.tsx',
  'src/components/forms/StandardForm.tsx',
  'src/components/gdpr/CookieConsentBanner.tsx',
  'src/components/gdpr/DataDeletionDialog.tsx',
  'src/components/gdpr/DataExportDialog.tsx',
  'src/components/marketing/SocialShareButtons.tsx',
  'src/components/marketing/UTMTracker.tsx',
  'src/components/ui/DynamicPageRenderer.tsx',
  'src/components/ui/SafeComponentWrapper.tsx',
  'src/components/ui/SafeErrorFallback.tsx',
  'src/components/ui/SafeReactWrapper.tsx',
  'src/components/ui/SafeRouter.tsx',
  'src/components/ui/SimpleErrorBoundary.tsx',
  'src/components/ui/lazy-wrapper.tsx',
  'src/components/ui/react-safety-wrapper.tsx',
  'src/components/ui/reload-prevention-wrapper.tsx',
  'src/components/ui/error-boundary.tsx',
  'src/components/ui/global-error-boundary.tsx',
  'src/components/ui/mobile-error-handler.tsx',
  'src/contexts/AuthContext.tsx'
];

// Replacement mappings - comprehensive patterns
const replacements = {
  // Error patterns
  "console.error('Error": "logError('Error",
  "console.error(`Error": "logError(`Error",
  'console.error("Error': 'logError("Error',
  "console.error('": "logError('",
  "console.error(`": "logError(`",
  'console.error("': 'logError("',
  "console.error(": "logError(",
  
  // Log patterns  
  "console.log('": "logInfo('",
  "console.log(`": "logInfo(`",
  'console.log("': 'logInfo("',
  "console.log(": "logInfo(",
  
  // Info patterns
  "console.info('": "logInfo('",
  "console.info(`": "logInfo(`",
  'console.info("': 'logInfo("',
  "console.info(": "logInfo(",
  
  // Warn patterns
  "console.warn('": "logWarn('",
  "console.warn(`": "logWarn(`",
  'console.warn("': 'logWarn("',
  "console.warn(": "logWarn(",
  
  // Debug patterns
  "console.debug('": "logDebug('",
  "console.debug(`": "logDebug(`",
  'console.debug("': 'logDebug("',
  "console.debug(": "logDebug(",
};

// Logger import statement
const loggerImport = "import { logError, logWarn, logInfo, logDebug } from '@/utils/logger';";

function processFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  // Check if file has console statements
  const hasConsole = /console\.(log|error|warn|info|debug)/.test(content);
  if (!hasConsole) {
    console.log(`✅ ${filePath} - No console statements found`);
    return;
  }

  // Add logger import if not present
  if (!content.includes("from '@/utils/logger'")) {
    // Find the last import statement
    const importLines = content.split('\n').filter(line => line.trim().startsWith('import'));
    if (importLines.length > 0) {
      const lastImportIndex = content.lastIndexOf(importLines[importLines.length - 1]);
      const insertPoint = content.indexOf('\n', lastImportIndex) + 1;
      content = content.slice(0, insertPoint) + loggerImport + '\n' + content.slice(insertPoint);
      modified = true;
    }
  }

  // Apply replacements
  for (const [from, to] of Object.entries(replacements)) {
    if (content.includes(from)) {
      content = content.replaceAll(from, to);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`🔄 ${filePath} - Console statements replaced with logger`);
  } else {
    console.log(`✅ ${filePath} - No changes needed`);
  }
}

// Process all files
console.log('🚀 Starting console cleanup for production...\n');

filesToProcess.forEach(processFile);

console.log('\n✅ Console cleanup completed!');
console.log('📊 Production optimizations applied:');
console.log('  - Console statements replaced with production-safe logger');
console.log('  - Error handling preserved for critical issues');
console.log('  - Debug information removed from production builds');
// Utility to help replace console statements with logger calls
// This helps identify patterns and provides replacement mappings

export const consoleReplacements = {
  // Error logging
  "console.error('Error": "logError('Error",
  "console.error(`Error": "logError(`Error",
  "console.error(\"Error": "logError(\"Error",
  
  // Info/Log statements
  "console.log('": "logInfo('",
  "console.log(`": "logInfo(`",
  "console.log(\"": "logInfo(\"",
  "console.info('": "logInfo('",
  "console.info(`": "logInfo(`",
  "console.info(\"": "logInfo(\"",
  
  // Warning statements
  "console.warn('": "logWarn('",
  "console.warn(`": "logWarn(`",
  "console.warn(\"": "logWarn(\"",
  
  // Debug statements
  "console.debug('": "logDebug('",
  "console.debug(`": "logDebug(`",
  "console.debug(\"": "logDebug(\"",
};

// Common import statement to add
export const loggerImport = "import { logError, logWarn, logInfo, logDebug } from '@/utils/logger';";

// Files that need the logger import
export const filesToUpdateImports = [
  'src/hooks/useAdminActivityLogs.tsx',
  'src/hooks/useAdminCourses.tsx',
  'src/hooks/useAdvancedAnalytics.tsx',
  'src/hooks/useAppointmentBooking.tsx',
  'src/hooks/useBlogManagement.tsx',
  'src/hooks/useCourseContent.tsx',
  'src/hooks/useCourseInteractions.tsx',
  'src/hooks/useCourses.tsx',
  'src/hooks/useDashboardMetrics.tsx',
  'src/hooks/useEnhancedLearning.tsx',
  'src/hooks/useEnrollment.tsx',
  'src/hooks/useGamification.tsx',
  'src/hooks/useNotifications.tsx',
  'src/hooks/useSystemHealth.tsx',
  'src/hooks/useUserProfile.tsx'
];

import React from "react";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import SafeRouter from "@/components/ui/SafeRouter";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import AdminRouteGuard from "@/components/admin/AdminRouteGuard";
import ProfessorRouteGuard from "@/components/professor/ProfessorRouteGuard";
import StudentRouteGuard from "@/components/student/StudentRouteGuard";
import { RoleRouter } from "@/components/auth/RoleRouter";
import { GlobalErrorBoundary } from "@/components/ui/global-error-boundary";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { usePageTracking, useScrollTracking } from "@/hooks/useAnalytics";
import UTMTracker from "@/components/marketing/UTMTracker";
import SEOAnalytics from "@/components/SEOAnalytics";
import StructuredData from "@/components/StructuredData";
import ReactSafetyWrapper from "@/components/ui/react-safety-wrapper";
import CookieConsentBanner from "@/components/gdpr/CookieConsentBanner";
import SafeGDPRWrapper from "@/components/gdpr/SafeGDPRWrapper";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { ReloadPreventionWrapper } from "@/components/ui/reload-prevention-wrapper";
import { SecurityEnhancedWrapper } from "@/components/security/SecurityEnhancedWrapper";
import { logWarn } from "@/utils/logger";
import { lazyWithRetry } from "@/utils/lazyWithRetry";

// Lazy load chatbot to improve admin page performance
const AIChatbot = React.lazy(() => import("@/components/chatbot/AIChatbot"));


// Critical pages (loaded immediately for better performance)
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Features from "./pages/Features";

// Lazy load ALL secondary pages for optimal performance
const Curriculum = lazyWithRetry(() => import("./pages/Curriculum"));
const AICourse = lazyWithRetry(() => import("./pages/AICourse"));
const ProgrammingCourse = lazyWithRetry(() => import("./pages/ProgrammingCourse"));
const CybersecurityCourse = lazyWithRetry(() => import("./pages/CybersecurityCourse"));
const GenericCourse = lazyWithRetry(() => import("./pages/GenericCourse"));
const CourseDetailPage = lazyWithRetry(() => import("./components/course-detail/CourseDetailPage"));
const CoursePlayer = lazyWithRetry(() => import("./pages/CoursePlayer"));
const Instructors = lazyWithRetry(() => import("./pages/Instructors"));
const Testimonials = lazyWithRetry(() => import("./pages/Testimonials"));
const Register = lazyWithRetry(() => import("./pages/Register"));
const ResetPassword = lazyWithRetry(() => import("./pages/ResetPassword"));
const About = lazyWithRetry(() => import("./pages/About"));
const FAQ = lazyWithRetry(() => import("./pages/FAQ"));
const Careers = lazyWithRetry(() => import("./pages/Careers"));
const Contact = lazyWithRetry(() => import("./pages/Contact"));
const Appointment = lazyWithRetry(() => import("./pages/Appointment"));
const PrivacyPolicy = lazyWithRetry(() => import("./pages/PrivacyPolicy"));
const TermsOfUse = lazyWithRetry(() => import("./pages/TermsOfUse"));
const CookiesPolicy = lazyWithRetry(() => import("./pages/CookiesPolicy"));
const Auth = lazyWithRetry(() => import("./pages/Auth"));
const Dashboard = lazyWithRetry(() => import("./pages/Dashboard"));
const Blog = lazyWithRetry(() => import("./pages/Blog"));
const BlogPost = lazyWithRetry(() => import("./pages/BlogPost"));
const BlogGuideIA2024 = lazyWithRetry(() => import("./pages/BlogGuideIA2024"));
const BlogDevenirDeveloppeur = lazyWithRetry(() => import("./pages/BlogDevenirDeveloppeur"));
const AVSInstitute = lazyWithRetry(() => import("./pages/AVSInstitute"));

// Admin pages (heavy components - lazy load with retry)
const AdminCourses = lazyWithRetry(() => import("./pages/AdminCourses"));
const AdminTest = lazyWithRetry(() => import("./pages/AdminTest"));
const Admin = lazyWithRetry(() => import("./pages/Admin"));
const ClassDetailPage = lazyWithRetry(() => import("./pages/ClassDetailPage"));

// Professor and Student pages with retry logic
const Professor = lazyWithRetry(() => import("./pages/Professor"));
const ProfessorCourse = lazyWithRetry(() => import("./pages/ProfessorCourse"));
const Student = lazyWithRetry(() => import("./pages/Student"));

// Optimized lazy wrapper component
const LazyWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <React.Suspense 
    fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    }
  >
    {children}
  </React.Suspense>
);

// Analytics wrapper component to handle hooks inside Router context
const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  try {
    usePageTracking();
    useScrollTracking();
  } catch (error) {
    logWarn('Analytics tracking failed:', error);
  }
  return <>{children}</>;
};

// Chatbot wrapper - skip rendering on admin routes for performance
const ChatbotWrapper: React.FC = () => {
  const location = window.location.pathname;
  const isAdminRoute = location.startsWith('/admin');
  
  if (isAdminRoute) return null;
  
  return (
    <React.Suspense fallback={null}>
      <AIChatbot />
    </React.Suspense>
  );
};

// Create QueryClient instance with aggressive caching for performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 10 * 60 * 1000, // 10 minutes - data stays fresh longer
      gcTime: 30 * 60 * 1000, // 30 minutes - keep in cache longer
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});


const App = () => {
  return (
    <GlobalErrorBoundary>
      <ReloadPreventionWrapper>
        <React.Suspense fallback={
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <div>Chargement de l'application...</div>
          </div>
        }>
          <SafeRouter>
            <ReactSafetyWrapper>
              <AnalyticsProvider>
                <ScrollToTop />
                <UTMTracker />
                <SEOAnalytics />
                <StructuredData type="website" />
                <CookieConsentBanner />
                <SecurityEnhancedWrapper>
                  <QueryClientProvider client={queryClient}>
                    {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
                    <AuthProvider>
                    <Routes>
                      {/* Critical routes - no lazy loading */}
                      <Route path="/" element={<Index />} />
                      <Route path="/features" element={<Features />} />
                      <Route path="*" element={<NotFound />} />
                      
                      {/* Secondary routes - lazy loaded */}
                      <Route path="/auth" element={<LazyWrapper><Auth /></LazyWrapper>} />
                      <Route path="/reset-password" element={<LazyWrapper><ResetPassword /></LazyWrapper>} />
                      <Route path="/dashboard" element={<StudentRouteGuard><LazyWrapper><Dashboard /></LazyWrapper></StudentRouteGuard>} />
                      <Route path="/curriculum" element={<LazyWrapper><Curriculum /></LazyWrapper>} />
                      <Route path="/ai-course" element={<LazyWrapper><AICourse /></LazyWrapper>} />
                      <Route path="/programming-course" element={<LazyWrapper><ProgrammingCourse /></LazyWrapper>} />
                      <Route path="/cybersecurity-course" element={<LazyWrapper><CybersecurityCourse /></LazyWrapper>} />
                      <Route path="/course/:slug" element={<LazyWrapper><GenericCourse /></LazyWrapper>} />
                      <Route path="/learn/:slug" element={<LazyWrapper><CoursePlayer /></LazyWrapper>} />
                      <Route path="/instructors" element={<LazyWrapper><Instructors /></LazyWrapper>} />
                      <Route path="/testimonials" element={<LazyWrapper><Testimonials /></LazyWrapper>} />
                      <Route path="/about" element={<LazyWrapper><About /></LazyWrapper>} />
                      <Route path="/register" element={<LazyWrapper><Register /></LazyWrapper>} />
                      <Route path="/careers" element={<LazyWrapper><Careers /></LazyWrapper>} />
                      <Route path="/contact" element={<LazyWrapper><Contact /></LazyWrapper>} />
                      <Route path="/appointment" element={<LazyWrapper><Appointment /></LazyWrapper>} />
                      <Route path="/blog" element={<LazyWrapper><Blog /></LazyWrapper>} />
                      <Route path="/blog/:slug" element={<LazyWrapper><BlogPost /></LazyWrapper>} />
                      <Route path="/blog/guide-ia-maroc-2024" element={<LazyWrapper><BlogGuideIA2024 /></LazyWrapper>} />
                      <Route path="/blog/devenir-developpeur-maroc" element={<LazyWrapper><BlogDevenirDeveloppeur /></LazyWrapper>} />
                      <Route path="/faq" element={<LazyWrapper><FAQ /></LazyWrapper>} />
                      <Route path="/tsia-tsdi" element={<LazyWrapper><AVSInstitute /></LazyWrapper>} />
                      <Route path="/privacy-policy" element={<LazyWrapper><PrivacyPolicy /></LazyWrapper>} />
                      <Route path="/terms-of-use" element={<LazyWrapper><TermsOfUse /></LazyWrapper>} />
                      <Route path="/cookies-policy" element={<LazyWrapper><CookiesPolicy /></LazyWrapper>} />
                      
                      {/* Admin routes - protected and lazy loaded */}
                      <Route path="/admin" element={<AdminRouteGuard><LazyWrapper><Admin /></LazyWrapper></AdminRouteGuard>} />
                      <Route path="/admin/courses" element={<AdminRouteGuard><LazyWrapper><AdminCourses /></LazyWrapper></AdminRouteGuard>} />
                      <Route path="/admin/test" element={<AdminRouteGuard><LazyWrapper><AdminTest /></LazyWrapper></AdminRouteGuard>} />
                      <Route path="/admin/chatbot" element={<AdminRouteGuard><LazyWrapper>{React.createElement(lazyWithRetry(() => import('@/pages/AdminChatbotManagement')))}</LazyWrapper></AdminRouteGuard>} />
                      <Route path="/admin/classes/:classId" element={<AdminRouteGuard><LazyWrapper><ClassDetailPage /></LazyWrapper></AdminRouteGuard>} />
                      
                      {/* Professor routes - protected and lazy loaded */}
                      <Route path="/professor" element={<ProfessorRouteGuard><LazyWrapper><Professor /></LazyWrapper></ProfessorRouteGuard>} />
                      <Route path="/professor/course/:courseId" element={<ProfessorRouteGuard><LazyWrapper><ProfessorCourse /></LazyWrapper></ProfessorRouteGuard>} />
                      
                      {/* Student routes - protected and lazy loaded */}
                      <Route path="/student" element={<StudentRouteGuard><LazyWrapper><Student /></LazyWrapper></StudentRouteGuard>} />
                    </Routes>
                    
                    <ChatbotWrapper />
                    <Toaster />
                    </AuthProvider>
                  </QueryClientProvider>
                </SecurityEnhancedWrapper>
              </AnalyticsProvider>
            </ReactSafetyWrapper>
          </SafeRouter>
        </React.Suspense>
      </ReloadPreventionWrapper>
    </GlobalErrorBoundary>
  );
};

export default App;

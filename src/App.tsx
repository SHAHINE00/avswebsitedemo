
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


// Critical pages (loaded immediately for better performance)
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Features from "./pages/Features";

// Lazy load secondary pages
const Curriculum = React.lazy(() => import("./pages/Curriculum"));
const AICourse = React.lazy(() => import("./pages/AICourse"));
const ProgrammingCourse = React.lazy(() => import("./pages/ProgrammingCourse"));
const CybersecurityCourse = React.lazy(() => import("./pages/CybersecurityCourse"));
const GenericCourse = React.lazy(() => import("./pages/GenericCourse"));
const CourseDetailPage = React.lazy(() => import("./components/course-detail/CourseDetailPage"));
const CoursePlayer = React.lazy(() => import("./pages/CoursePlayer"));
const Instructors = React.lazy(() => import("./pages/Instructors"));
const Testimonials = React.lazy(() => import("./pages/Testimonials"));
const Register = React.lazy(() => import("./pages/Register"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const About = React.lazy(() => import("./pages/About"));
const FAQ = React.lazy(() => import("./pages/FAQ"));
const Careers = React.lazy(() => import("./pages/Careers"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Appointment = React.lazy(() => import("./pages/Appointment"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfUse = React.lazy(() => import("./pages/TermsOfUse"));
const CookiesPolicy = React.lazy(() => import("./pages/CookiesPolicy"));
const Auth = React.lazy(() => import("./pages/Auth"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Blog = React.lazy(() => import("./pages/Blog"));
const BlogPost = React.lazy(() => import("./pages/BlogPost"));
const BlogGuideIA2024 = React.lazy(() => import("./pages/BlogGuideIA2024"));
const BlogDevenirDeveloppeur = React.lazy(() => import("./pages/BlogDevenirDeveloppeur"));
const AVSInstitute = React.lazy(() => import("./pages/AVSInstitute"));

// Admin pages (heavy components - lazy load)
const AdminCourses = React.lazy(() => import("./pages/AdminCourses"));
const AdminTest = React.lazy(() => import("./pages/AdminTest"));
const Admin = React.lazy(() => import("./pages/Admin"));

// Professor pages
const Professor = React.lazy(() => import("./pages/Professor"));
const ProfessorCourse = React.lazy(() => import("./pages/ProfessorCourse"));

// Student pages
const Student = React.lazy(() => import("./pages/Student"));

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

// Create QueryClient instance outside component to prevent recreation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      gcTime: 15 * 60 * 1000, // 15 minutes (replaces cacheTime)
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
                <ReactSafetyWrapper>
                  <ScrollToTop />
                </ReactSafetyWrapper>
                <ReactSafetyWrapper>
                  <UTMTracker />
                </ReactSafetyWrapper>
                <ReactSafetyWrapper>
                  <SEOAnalytics />
                </ReactSafetyWrapper>
                <ReactSafetyWrapper>
                  <StructuredData type="website" />
                </ReactSafetyWrapper>
                <ReactSafetyWrapper>
                  <CookieConsentBanner />
                </ReactSafetyWrapper>
                <ReactSafetyWrapper>
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
                      
                      {/* Professor routes - protected and lazy loaded */}
                      <Route path="/professor" element={<ProfessorRouteGuard><LazyWrapper><Professor /></LazyWrapper></ProfessorRouteGuard>} />
                      <Route path="/professor/course/:courseId" element={<ProfessorRouteGuard><LazyWrapper><ProfessorCourse /></LazyWrapper></ProfessorRouteGuard>} />
                      
                      {/* Student routes - protected and lazy loaded */}
                      <Route path="/student" element={<StudentRouteGuard><LazyWrapper><Student /></LazyWrapper></StudentRouteGuard>} />
                      </Routes>
                      
                        <Toaster />
                      </AuthProvider>
                    </QueryClientProvider>
                  </SecurityEnhancedWrapper>
                </ReactSafetyWrapper>
              </AnalyticsProvider>
            </ReactSafetyWrapper>
          </SafeRouter>
        </React.Suspense>
      </ReloadPreventionWrapper>
    </GlobalErrorBoundary>
  );
};

export default App;

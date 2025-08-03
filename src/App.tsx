
import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import AdminRouteGuard from "@/components/admin/AdminRouteGuard";
import { GlobalErrorBoundary } from "@/components/ui/global-error-boundary";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { usePageTracking, useScrollTracking } from "@/hooks/useAnalytics";
import UTMTracker from "@/components/marketing/UTMTracker";
import SEOAnalytics from "@/components/SEOAnalytics";
import StructuredData from "@/components/StructuredData";
import LoadingSpinner from "@/components/ui/loading-spinner";
import RealtimeNotifications from "@/components/interactive/RealtimeNotifications";
import { usePageTransition } from "@/hooks/usePageTransition";

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
const About = React.lazy(() => import("./pages/About"));
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

// Admin pages (heavy components - lazy load)
const AdminCourses = React.lazy(() => import("./pages/AdminCourses"));
const AdminTest = React.lazy(() => import("./pages/AdminTest"));
const Admin = React.lazy(() => import("./pages/Admin"));

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
  const { transitionClasses } = usePageTransition();
  
  try {
    usePageTracking();
    useScrollTracking();
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
  
  return (
    <div className={`min-h-screen ${transitionClasses}`}>
      {children}
    </div>
  );
};

const App = () => {
  // Early React validation check
  if (typeof React === 'undefined' || React === null) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Chargement en cours...</h1>
        <p>Application en cours de démarrage</p>
      </div>
    );
  }
  return (
    <GlobalErrorBoundary>
      <React.Suspense fallback={
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div>Chargement de l'application...</div>
        </div>
      }>
        <Router>
          <AnalyticsProvider>
            <ScrollToTop />
            <UTMTracker />
            <SEOAnalytics />
            <StructuredData type="website" />
            <AuthProvider>
          <Routes>
            {/* Critical routes - no lazy loading */}
            <Route path="/" element={<Index />} />
            <Route path="/features" element={<Features />} />
            <Route path="*" element={<NotFound />} />
            
            {/* Secondary routes - lazy loaded */}
            <Route path="/auth" element={<LazyWrapper><Auth /></LazyWrapper>} />
            <Route path="/dashboard" element={<LazyWrapper><Dashboard /></LazyWrapper>} />
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
            <Route path="/privacy-policy" element={<LazyWrapper><PrivacyPolicy /></LazyWrapper>} />
            <Route path="/terms-of-use" element={<LazyWrapper><TermsOfUse /></LazyWrapper>} />
            <Route path="/cookies-policy" element={<LazyWrapper><CookiesPolicy /></LazyWrapper>} />
            
            {/* Admin routes - protected and lazy loaded */}
            <Route path="/admin" element={<AdminRouteGuard><LazyWrapper><Admin /></LazyWrapper></AdminRouteGuard>} />
            <Route path="/admin/courses" element={<AdminRouteGuard><LazyWrapper><AdminCourses /></LazyWrapper></AdminRouteGuard>} />
            <Route path="/admin/test" element={<AdminRouteGuard><LazyWrapper><AdminTest /></LazyWrapper></AdminRouteGuard>} />
            </Routes>
            <RealtimeNotifications />
            <Toaster />
          </AuthProvider>
          </AnalyticsProvider>
        </Router>
      </React.Suspense>
    </GlobalErrorBoundary>
  );
};

export default App;

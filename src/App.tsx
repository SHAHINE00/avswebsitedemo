
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import AdminRouteGuard from "@/components/admin/AdminRouteGuard";
import { GlobalErrorBoundary } from "@/components/ui/global-error-boundary";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { usePageTracking, useScrollTracking } from "@/hooks/useAnalytics";
import AnalyticsWrapper from "@/components/AnalyticsWrapper";
import UTMTracker from "@/components/marketing/UTMTracker";
import { lazy, useEffect } from "react";

// Core pages (loaded immediately)
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load heavy pages and admin components
const Features = lazy(() => import("./pages/Features"));
const Curriculum = lazy(() => import("./pages/Curriculum"));
const AICourse = lazy(() => import("./pages/AICourse"));
const ProgrammingCourse = lazy(() => import("./pages/ProgrammingCourse"));
const CybersecurityCourse = lazy(() => import("./pages/CybersecurityCourse"));
const GenericCourse = lazy(() => import("./pages/GenericCourse"));
const CoursePlayer = lazy(() => import("./pages/CoursePlayer"));
const Instructors = lazy(() => import("./pages/Instructors"));
const Register = lazy(() => import("./pages/Register"));
const About = lazy(() => import("./pages/About"));
const Careers = lazy(() => import("./pages/Careers"));
const Contact = lazy(() => import("./pages/Contact"));
const Appointment = lazy(() => import("./pages/Appointment"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfUse = lazy(() => import("./pages/TermsOfUse"));
const CookiesPolicy = lazy(() => import("./pages/CookiesPolicy"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));

// Admin pages (heavy components)
const AdminCourses = lazy(() => import("./pages/AdminCourses"));
const AdminTest = lazy(() => import("./pages/AdminTest"));
const Admin = lazy(() => import("./pages/Admin"));

// WordPress/Export tools
const ElementorExport = lazy(() => import("./pages/ElementorExport"));
const WordPressGuide = lazy(() => import("./pages/WordPressGuide"));

const App = () => {
  console.log('iOS Debug: App component rendering');
  
  // iOS-specific initialization check
  useEffect(() => {
    console.log('iOS Debug: App useEffect running');
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    console.log('iOS Debug: In App, isIOS:', isIOS);
    if (isIOS) {
      console.log('iOS Debug: iOS device detected in App component');
    }
  }, []);

  return (
    <GlobalErrorBoundary>
      <Router>
        <UTMTracker />
        <AnalyticsWrapper />
      </Router>
    </GlobalErrorBoundary>
  );
};

export default App;

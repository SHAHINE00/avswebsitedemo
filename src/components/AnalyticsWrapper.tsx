import React, { lazy } from 'react';
import { usePageTracking, useScrollTracking } from '@/hooks/useAnalytics';
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import AdminRouteGuard from "@/components/admin/AdminRouteGuard";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { LazyWrapper } from "@/components/ui/lazy-wrapper";

// Lazy load all pages for code splitting
const Index = lazy(() => import("@/pages/Index"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Features = lazy(() => import("@/pages/Features"));
const Curriculum = lazy(() => import("@/pages/Curriculum"));
const AICourse = lazy(() => import("@/pages/AICourse"));
const ProgrammingCourse = lazy(() => import("@/pages/ProgrammingCourse"));
const CybersecurityCourse = lazy(() => import("@/pages/CybersecurityCourse"));
const GenericCourse = lazy(() => import("@/pages/GenericCourse"));
const CoursePlayer = lazy(() => import("@/pages/CoursePlayer"));
const Instructors = lazy(() => import("@/pages/Instructors"));
const Testimonials = lazy(() => import("@/pages/Testimonials"));
const Register = lazy(() => import("@/pages/Register"));
const About = lazy(() => import("@/pages/About"));
const Careers = lazy(() => import("@/pages/Careers"));
const Contact = lazy(() => import("@/pages/Contact"));
const Appointment = lazy(() => import("@/pages/Appointment"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfUse = lazy(() => import("@/pages/TermsOfUse"));
const CookiesPolicy = lazy(() => import("@/pages/CookiesPolicy"));
const Auth = lazy(() => import("@/pages/Auth"));
const AdminCourses = lazy(() => import("@/pages/AdminCourses"));
const AdminTest = lazy(() => import("@/pages/AdminTest"));
const Admin = lazy(() => import("@/pages/Admin"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));

const AnalyticsWrapper: React.FC = () => {
  console.log('iOS Debug: AnalyticsWrapper rendering');
  
  // Initialize analytics tracking inside Router context
  usePageTracking();
  useScrollTracking();
  
  React.useEffect(() => {
    console.log('iOS Debug: AnalyticsWrapper mounted');
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      console.log('iOS Debug: iOS device in AnalyticsWrapper');
      console.log('iOS Debug: Window location:', window.location.href);
      console.log('iOS Debug: Document ready state:', document.readyState);
    }
  }, []);

  return (
    <>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LazyWrapper><Index /></LazyWrapper>} />
          <Route path="/auth" element={<LazyWrapper><Auth /></LazyWrapper>} />
          <Route path="/dashboard" element={<LazyWrapper><Dashboard /></LazyWrapper>} />
          <Route path="/admin" element={<AdminRouteGuard><LazyWrapper><Admin /></LazyWrapper></AdminRouteGuard>} />
          <Route path="/admin/courses" element={<AdminRouteGuard><LazyWrapper><AdminCourses /></LazyWrapper></AdminRouteGuard>} />
          <Route path="/admin/test" element={<AdminRouteGuard><LazyWrapper><AdminTest /></LazyWrapper></AdminRouteGuard>} />
          <Route path="/features" element={<LazyWrapper><Features /></LazyWrapper>} />
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
          <Route path="*" element={<LazyWrapper><NotFound /></LazyWrapper>} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </>
  );
};

export default AnalyticsWrapper;
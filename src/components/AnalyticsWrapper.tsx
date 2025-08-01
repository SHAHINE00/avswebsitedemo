import React from 'react';
import { usePageTracking, useScrollTracking } from '@/hooks/useAnalytics';
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import AdminRouteGuard from "@/components/admin/AdminRouteGuard";
import ScrollToTop from "@/components/ui/ScrollToTop";

// Import all pages
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Features from "@/pages/Features";
import Curriculum from "@/pages/Curriculum";
import AICourse from "@/pages/AICourse";
import ProgrammingCourse from "@/pages/ProgrammingCourse";
import CybersecurityCourse from "@/pages/CybersecurityCourse";
import GenericCourse from "@/pages/GenericCourse";
import CoursePlayer from "@/pages/CoursePlayer";
import Instructors from "@/pages/Instructors";
import Register from "@/pages/Register";
import About from "@/pages/About";
import Careers from "@/pages/Careers";
import Contact from "@/pages/Contact";
import Appointment from "@/pages/Appointment";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfUse from "@/pages/TermsOfUse";
import CookiesPolicy from "@/pages/CookiesPolicy";
import Auth from "@/pages/Auth";
import AdminCourses from "@/pages/AdminCourses";
import AdminTest from "@/pages/AdminTest";
import Admin from "@/pages/Admin";
import Dashboard from "@/pages/Dashboard";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";

const AnalyticsWrapper: React.FC = () => {
  // Initialize analytics tracking inside Router context
  usePageTracking();
  useScrollTracking();

  return (
    <>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminRouteGuard><Admin /></AdminRouteGuard>} />
          <Route path="/admin/courses" element={<AdminRouteGuard><AdminCourses /></AdminRouteGuard>} />
          <Route path="/admin/test" element={<AdminRouteGuard><AdminTest /></AdminRouteGuard>} />
          <Route path="/features" element={<Features />} />
          <Route path="/curriculum" element={<Curriculum />} />
          <Route path="/ai-course" element={<AICourse />} />
          <Route path="/programming-course" element={<ProgrammingCourse />} />
          <Route path="/cybersecurity-course" element={<CybersecurityCourse />} />
          <Route path="/course/:slug" element={<GenericCourse />} />
          <Route path="/learn/:slug" element={<CoursePlayer />} />
          <Route path="/instructors" element={<Instructors />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/cookies-policy" element={<CookiesPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </>
  );
};

export default AnalyticsWrapper;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import AdminRouteGuard from "@/components/admin/AdminRouteGuard";
import { GlobalErrorBoundary } from "@/components/ui/global-error-boundary";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { usePageTracking, useScrollTracking } from "@/hooks/useAnalytics";
import AnalyticsWrapper from "@/components/AnalyticsWrapper";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ElementorExport from "./pages/ElementorExport";
import WordPressGuide from "./pages/WordPressGuide";
import Features from "./pages/Features";
import Curriculum from "./pages/Curriculum";
import AICourse from "./pages/AICourse";
import ProgrammingCourse from "./pages/ProgrammingCourse";
import CybersecurityCourse from "./pages/CybersecurityCourse";
import GenericCourse from "./pages/GenericCourse";
import CoursePlayer from "./pages/CoursePlayer";
import Instructors from "./pages/Instructors";
import Register from "./pages/Register";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Appointment from "./pages/Appointment";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import CookiesPolicy from "./pages/CookiesPolicy";
import Auth from "./pages/Auth";
import AdminCourses from "./pages/AdminCourses";
import AdminTest from "./pages/AdminTest";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

const App = () => {
  return (
    <GlobalErrorBoundary>
      <Router>
        <AnalyticsWrapper />
      </Router>
    </GlobalErrorBoundary>
  );
};

export default App;

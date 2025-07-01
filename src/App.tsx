import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
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
import Instructors from "./pages/Instructors";
import Testimonials from "./pages/Testimonials";
import Register from "./pages/Register";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Appointment from "./pages/Appointment";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import CookiesPolicy from "./pages/CookiesPolicy";
import Auth from "./pages/Auth";
import AdminCourses from "./pages/AdminCourses";
import AdminTest from "./pages/AdminTest";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/test" element={<AdminTest />} />
          <Route path="/features" element={<Features />} />
          <Route path="/curriculum" element={<Curriculum />} />
          {/* Legacy course routes - keep for backward compatibility */}
          <Route path="/ai-course" element={<AICourse />} />
          <Route path="/programming-course" element={<ProgrammingCourse />} />
          <Route path="/cybersecurity-course" element={<CybersecurityCourse />} />
          {/* Dynamic course route - handles all new courses automatically */}
          <Route path="/course/:slug" element={<GenericCourse />} />
          <Route path="/instructors" element={<Instructors />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/register" element={<Register />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/cookies-policy" element={<CookiesPolicy />} />
          <Route path="/elementor-export" element={<WordPressGuide />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
};

export default App;

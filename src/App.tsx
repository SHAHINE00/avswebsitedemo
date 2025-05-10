
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ElementorExport from "./pages/ElementorExport";
import WordPressGuide from "./pages/WordPressGuide";
import Features from "./pages/Features";
import Curriculum from "./pages/Curriculum";
import AICourse from "./pages/AICourse";
import ProgrammingCourse from "./pages/ProgrammingCourse";
import Instructors from "./pages/Instructors";
import Testimonials from "./pages/Testimonials";
import Register from "./pages/Register";
import Video from "./pages/Video";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import CookiesPolicy from "./pages/CookiesPolicy";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/features" element={<Features />} />
        <Route path="/curriculum" element={<Curriculum />} />
        <Route path="/ai-course" element={<AICourse />} />
        <Route path="/programming-course" element={<ProgrammingCourse />} />
        <Route path="/instructors" element={<Instructors />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/register" element={<Register />} />
        <Route path="/video" element={<Video />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/cookies-policy" element={<CookiesPolicy />} />
        <Route path="/elementor-export" element={<WordPressGuide />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;

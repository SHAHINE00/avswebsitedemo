import { Link } from "react-router-dom";
import { useSafeLocation, useSafeEffect } from '@/utils/safeHooks';
import { logError } from '@/utils/logger';
import SEOHead from '@/components/SEOHead';
import { utilityPagesSEO } from '@/utils/seoData';

const NotFound = () => {
  const location = useSafeLocation();

  useSafeEffect(() => {
    logError(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <SEOHead {...utilityPagesSEO.notFound} />
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

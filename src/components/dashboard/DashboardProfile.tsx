import React from 'react';
import EnhancedUserProfile from '@/components/user/EnhancedUserProfile';
import { CourseBookmark } from '@/hooks/useCourseInteractions';

interface DashboardProfileProps {
  bookmarks: CourseBookmark[];
}

const DashboardProfile = ({ bookmarks }: DashboardProfileProps) => {
  return <EnhancedUserProfile />;
};

export default DashboardProfile;
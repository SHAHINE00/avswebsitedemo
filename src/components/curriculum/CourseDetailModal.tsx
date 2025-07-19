
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, Award, CheckCircle, Brain, Code, Database, Cloud, Target, Shield, Star } from 'lucide-react';
import EnrollmentButton from './EnrollmentButton';
import type { Course } from '@/hooks/useCourses';
import type { LucideIcon } from 'lucide-react';

interface CourseDetailModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

const iconMap: { [key: string]: LucideIcon } = {
  brain: Brain,
  code: Code,
  database: Database,
  cloud: Cloud,
  target: Target,
  shield: Shield,
};

const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  isOpen,
  onClose,
}) => {
  if (!course) return null;

  const IconComponent = iconMap[course.icon] || Brain;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-4 mb-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${course.gradient_from} ${course.gradient_to} flex items-center justify-center`}>
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                {course.title}
              </DialogTitle>
              {course.subtitle && (
                <p className="text-gray-600">{course.subtitle}</p>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Duration Badge */}
          {course.duration && (
            <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${course.gradient_from} ${course.gradient_to} text-white font-medium`}>
              <Clock className="w-4 h-4 mr-2" />
              {course.duration}
            </div>
          )}

          {/* Course Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Modules */}
            {course.modules && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-gray-500" />
                  <h4 className="font-semibold text-gray-900">Modules</h4>
                </div>
                <p className="text-gray-700 ml-7">{course.modules}</p>
              </div>
            )}

            {/* Diploma */}
            {course.diploma && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-gray-500" />
                  <h4 className="font-semibold text-gray-900">Certification</h4>
                </div>
                <p className="text-gray-700 ml-7">{course.diploma}</p>
              </div>
            )}
          </div>

          {/* Certification Provider */}
          {course.certification_provider_name && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>Certification & Accréditation</span>
              </h4>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center space-x-4">
                  {course.certification_provider_logo && (
                    <div className="flex-shrink-0">
                      <img 
                        src={course.certification_provider_logo} 
                        alt={`${course.certification_provider_name} logo`}
                        className="w-12 h-12 object-contain rounded-lg bg-white p-1 shadow-sm"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900 mb-1">
                      {course.certification_provider_name}
                    </h5>
                    {course.certification_recognition && (
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {course.certification_recognition}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          {(course.feature1 || course.feature2) && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Points Forts</h4>
              <div className="space-y-2">
                {course.feature1 && (
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <p className="text-gray-700 text-sm">{course.feature1}</p>
                  </div>
                )}
                {course.feature2 && (
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <p className="text-gray-700 text-sm">{course.feature2}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Enrollment Button */}
          <div className="pt-6 border-t border-gray-200">
            <EnrollmentButton courseId={course.id} linkTo={course.link_to || '#'} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseDetailModal;

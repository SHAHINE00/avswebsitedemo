import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Users, Award, Lightbulb } from 'lucide-react';
import AdvancedAnalytics from './AdvancedAnalytics';
import EnrollmentAnalytics from './EnrollmentAnalytics';
import CoursePerformanceMetrics from './CoursePerformanceMetrics';
import RealTimeAnalytics from './RealTimeAnalytics';
import CourseInsightsPanel from './analytics/CourseInsightsPanel';

const AnalyticsSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analytics et Rapports
          </CardTitle>
          <CardDescription>
            Analysez les performances, l'engagement et les métriques de votre plateforme
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-5 max-w-3xl">
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="realtime" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Temps Réel
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="enrollments" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Inscriptions
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="mt-6">
          <CourseInsightsPanel />
        </TabsContent>

        <TabsContent value="realtime" className="mt-6">
          <RealTimeAnalytics />
        </TabsContent>

        <TabsContent value="advanced" className="mt-6">
          <AdvancedAnalytics />
        </TabsContent>

        <TabsContent value="enrollments" className="mt-6">
          <EnrollmentAnalytics />
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <CoursePerformanceMetrics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsSection;
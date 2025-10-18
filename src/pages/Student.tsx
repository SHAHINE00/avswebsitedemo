import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CourseCatalog from '@/components/student/CourseCatalog';
import MyCourses from '@/components/student/MyCourses';
import NotificationCenter from '@/components/student/NotificationCenter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, BookOpen, Bell, Calendar, ClipboardCheck } from 'lucide-react';
import { MySchedule } from '@/components/student/MySchedule';
import { MyAttendance } from '@/components/student/MyAttendance';

const Student: React.FC = () => {
  const [activeTab, setActiveTab] = useState('catalog');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tableau de bord étudiant</h1>
          <p className="text-muted-foreground">
            Gérez vos cours et suivez votre progression
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Emploi du temps
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              Présences
            </TabsTrigger>
            <TabsTrigger value="catalog" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Catalogue
            </TabsTrigger>
            <TabsTrigger value="my-courses" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Mes cours
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule">
            <MySchedule />
          </TabsContent>

          <TabsContent value="attendance">
            <MyAttendance />
          </TabsContent>

          <TabsContent value="catalog">
            <CourseCatalog />
          </TabsContent>

          <TabsContent value="my-courses">
            <MyCourses />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationCenter />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Student;

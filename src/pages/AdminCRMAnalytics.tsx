import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RevenueAnalytics } from "@/components/admin/dashboard/student-crm/RevenueAnalytics";
import { AtRiskStudentsDashboard } from "@/components/admin/dashboard/student-crm/AtRiskStudentsDashboard";
import { CommunicationCenter } from "@/components/admin/dashboard/student-crm/CommunicationCenter";
import { SegmentBuilder } from "@/components/admin/dashboard/student-crm/SegmentBuilder";

const AdminCRMAnalytics = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics & Communication CRM</h1>
      
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList>
          <TabsTrigger value="revenue">Revenus</TabsTrigger>
          <TabsTrigger value="atrisk">Étudiants à Risque</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <RevenueAnalytics />
        </TabsContent>

        <TabsContent value="atrisk">
          <AtRiskStudentsDashboard />
        </TabsContent>

        <TabsContent value="communication">
          <CommunicationCenter />
        </TabsContent>

        <TabsContent value="segments">
          <SegmentBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCRMAnalytics;

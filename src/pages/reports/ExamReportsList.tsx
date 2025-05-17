
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExamReports from "@/components/reports/ExamReports";
import ExamScoresReport from "@/components/reports/ExamScoresReport";
import { BookOpen, BarChart2 } from "lucide-react";

const ExamReportsList: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Exam Reports</h1>
        <p className="text-muted-foreground">
          View and analyze exam reports and student scores
        </p>
      </div>

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="reports">
            <BookOpen className="h-4 w-4 mr-2" />
            Exam Reports
          </TabsTrigger>
          <TabsTrigger value="scores">
            <BarChart2 className="h-4 w-4 mr-2" />
            Exam Scores
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="reports" className="mt-0">
          <ExamReports />
        </TabsContent>
        
        <TabsContent value="scores" className="mt-0">
          <ExamScoresReport />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExamReportsList;

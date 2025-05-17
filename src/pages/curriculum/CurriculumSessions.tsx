
import React, { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar as CalendarIcon, 
  List, 
} from "lucide-react";
import { useCurriculumSessions } from "@/hooks/useCurriculumSessions";
import CurriculumFilters from "@/components/curriculum/CurriculumFilters";
import CurriculumSessionsStats from "@/components/curriculum/CurriculumSessionsStats";
import CurriculumSessionsCalendar from "@/components/curriculum/CurriculumSessionsCalendar";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const CurriculumSessions: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");

  const {
    sessions,
    isLoading,
    stats,
    currentMonth,
    goToNextMonth,
    goToPreviousMonth,
    goToToday,
    filterDate,
    setFilterDate,
    refresh,
  } = useCurriculumSessions({
    sectionId: selectedSection !== "all" ? selectedSection : undefined,
    subjectId: selectedSubject !== "all" ? selectedSubject : undefined,
  });

  const handleRefresh = async () => {
    try {
      await refresh();
      toast({
        title: "Schedule refreshed",
        description: "The curriculum schedule has been refreshed",
      });
    } catch (error) {
      toast({
        title: "Error refreshing schedule",
        description: "Failed to refresh the curriculum schedule",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-2 mb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">Curriculum Sessions</h1>
            <Badge variant="outline" className="ml-2">
              {format(currentMonth, "MMMM yyyy")}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            View and manage your curriculum sessions and track progress
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} className="ml-auto">
            <List className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            Today
          </Button>

          <div className="flex items-center rounded-md border bg-background">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-none"
              onClick={goToPreviousMonth}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="px-4 py-2 text-sm font-medium">
              {format(currentMonth, "MMMM yyyy")}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-none"
              onClick={goToNextMonth}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <CurriculumFilters
        selectedSection={selectedSection}
        selectedSubject={selectedSubject}
        setSelectedSection={setSelectedSection}
        setSelectedSubject={setSelectedSubject}
      />

      <CurriculumSessionsStats stats={stats} isLoading={isLoading} />

      <CurriculumSessionsCalendar
        sessions={sessions}
        isLoading={isLoading}
        currentMonth={currentMonth}
        filterDate={filterDate}
        setFilterDate={setFilterDate}
      />
    </div>
  );
};

export default CurriculumSessions;

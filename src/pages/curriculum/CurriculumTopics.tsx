
import React, { useState } from "react";
import { useCurriculumTopics } from "@/hooks/useCurriculumTopics";
import CurriculumFilters from "@/components/curriculum/CurriculumFilters";
import CurriculumTopicsTable from "@/components/curriculum/CurriculumTopicsTable";

const CurriculumTopics: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { topics, isLoading, filteredTopics } = useCurriculumTopics({
    sectionId: selectedSection !== "all" ? selectedSection : undefined,
    subjectId: selectedSubject !== "all" ? selectedSubject : undefined,
    searchTerm,
    statusFilter,
  });

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Curriculum Topics</h1>
        <p className="text-muted-foreground">
          Browse and filter topics by section, subject, and status
        </p>
      </div>

      <CurriculumFilters
        selectedSection={selectedSection}
        selectedSubject={selectedSubject}
        setSelectedSection={setSelectedSection}
        setSelectedSubject={setSelectedSubject}
      />

      <CurriculumTopicsTable
        topics={filteredTopics}
        isLoading={isLoading}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
    </div>
  );
};

export default CurriculumTopics;

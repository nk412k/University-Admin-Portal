import React, { useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateFeeStats } from "@/utils/feeUtils";
import FeeStatisticsCards from "@/components/students/FeeStatisticsCards";
import FeeTable from "@/components/students/FeeTable";
import FeePagination from "@/components/students/FeePagination";
import FeeFilters from "@/components/students/FeeFilters";
import { useUniversity } from "@/contexts/UniversityContext";
import { useSections } from "@/hooks/useSections";
import { useStudentFees } from "@/hooks/useStudentFees";

const PAGE_SIZE = 10;

const StudentFees: React.FC = () => {
  const { activeUniversity } = useUniversity();
  const universityId = activeUniversity?.university_id;

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSection, setSelectedSection] = useState("all");

  const { sections, isLoading: sectionsLoading } = useSections(universityId);
  const { feeData, isLoading: feesLoading } = useStudentFees(universityId);

  const isLoading = sectionsLoading || feesLoading;

  const filteredStudents = useMemo(() => {
    return feeData.filter((student) => {
      return (
        selectedSection === "all" || student.section_id === selectedSection
      );
    });
  }, [feeData, selectedSection]);

  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      const statusOrder = { overdue: 0, pending: 1, paid: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    });
  }, [filteredStudents]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedSection]);

  const totalPages = Math.ceil(sortedStudents.length / PAGE_SIZE);
  const paginatedStudents = sortedStudents.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const getUniversityName = (universityId: string) => {
    return activeUniversity?.name || "Unknown";
  };

  const getSectionName = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    return section ? section.name : "Unknown";
  };

  const stats = calculateFeeStats(filteredStudents);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Fees</h1>
          <p className="text-muted-foreground">
            Track and manage student fee payments
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Fees</h1>
        <p className="text-muted-foreground">
          Track and manage student fee payments
        </p>
      </div>

      <FeeFilters
        sections={sections}
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
      />

      <FeeStatisticsCards
        totalFeesAmount={stats.totalFeesAmount}
        totalPendingAmount={stats.totalPendingAmount}
        overdue={stats.overdue}
        overduePercentage={stats.overduePercentage}
        paid={stats.paid}
        paidPercentage={stats.paidPercentage}
      />

      <FeeTable
        students={paginatedStudents}
        getSectionName={getSectionName}
        getUniversityName={getUniversityName}
      />

      {sortedStudents.length > 0 ? (
        <FeePagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          No results found with the current filters.
        </div>
      )}
    </div>
  );
};

export default StudentFees;

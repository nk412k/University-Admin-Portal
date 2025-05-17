import React from "react";
import { Section, Subject } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSections } from "@/hooks/useSections";
import { useSubjects } from "@/hooks/useSubjects";

interface CurriculumFiltersProps {
  selectedSection: string;
  selectedSubject: string;
  setSelectedSection: (sectionId: string) => void;
  setSelectedSubject: (subjectId: string) => void;
}

interface FilterSelectProps<T> {
  value: string;
  onChange: (value: string) => void;
  items: T[];
  disabled?: boolean;
  placeholder: string;
  labelKey: keyof T;
  valueKey: keyof T;
  allLabel?: string;
}

function FilterSelect<T>({
  value,
  onChange,
  items,
  disabled = false,
  placeholder,
  labelKey,
  valueKey,
  allLabel = "All",
}: FilterSelectProps<T>) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{allLabel}</SelectItem>
        {items.map((item) => (
          <SelectItem
            key={String(item[valueKey])}
            value={String(item[valueKey])}
          >
            {String(item[labelKey])}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const CurriculumFilters: React.FC<CurriculumFiltersProps> = ({
  selectedSection,
  selectedSubject,
  setSelectedSection,
  setSelectedSubject,
}) => {
  const { sections, isLoading: isLoadingSections } = useSections();
  const { subjects, isLoading: isLoadingSubjects } = useSubjects(sections);

  const filteredSubjects =
    selectedSection === "all"
      ? subjects
      : subjects.filter((subject) => subject.section_id === selectedSection);

  const handleSectionChange = (value: string) => {
    setSelectedSection(value);
    if (value !== selectedSection) {
      setSelectedSubject("all");
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center">
      <div className="w-full sm:w-1/3">
        <FilterSelect<Section>
          value={selectedSection}
          onChange={handleSectionChange}
          items={sections}
          disabled={isLoadingSections}
          placeholder="Filter by section"
          labelKey="name"
          valueKey="section_id"
          allLabel="All Sections"
        />
      </div>

      <div className="w-full sm:w-1/3">
        <FilterSelect<Subject>
          value={selectedSubject}
          onChange={setSelectedSubject}
          items={filteredSubjects}
          disabled={isLoadingSubjects}
          placeholder="Filter by subject"
          labelKey="name"
          valueKey="subject_id"
          allLabel="All Subjects"
        />
      </div>
    </div>
  );
};

export default CurriculumFilters;

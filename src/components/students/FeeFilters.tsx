
import React from "react";
import { Section } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FeeFiltersProps {
  sections: Section[];
  selectedSection: string;
  setSelectedSection: (sectionId: string) => void;
}

const FeeFilters: React.FC<FeeFiltersProps> = ({
  sections,
  selectedSection,
  setSelectedSection,
}) => {
  return (
    <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center">
      <div className="w-full sm:w-1/3">
        <Select
          value={selectedSection}
          onValueChange={setSelectedSection}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sections</SelectItem>
            {sections.map((section) => (
              <SelectItem key={section.id} value={section.id}>
                {section.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FeeFilters;

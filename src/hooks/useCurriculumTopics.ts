import { useState, useEffect, useMemo } from "react";
import { CurriculumTopic } from "@/types/curriculum";
import { fetchTopics } from "@/utils/curriculumUtils";

interface UseCurriculumTopicsProps {
  sectionId?: string;
  subjectId?: string;
  searchTerm?: string;
  statusFilter?: string;
}

interface UseCurriculumTopicsResult {
  topics: CurriculumTopic[];
  isLoading: boolean;
  filteredTopics: CurriculumTopic[];
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  refresh: () => Promise<void>;
}

export const useCurriculumTopics = ({
  sectionId,
  subjectId,
  searchTerm: initialSearchTerm = "",
  statusFilter: initialStatusFilter = "all",
}: UseCurriculumTopicsProps = {}): UseCurriculumTopicsResult => {
  const [topics, setTopics] = useState<CurriculumTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);

  const fetchTopicsData = async () => {
    setIsLoading(true);
    const data = await fetchTopics(sectionId, subjectId);
    setTopics(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTopicsData();
  }, [sectionId, subjectId]);

  const filteredTopics = useMemo(() => {
    let filtered = topics;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (topic) =>
          topic.name.toLowerCase().includes(searchLower) ||
          topic.subjectName.toLowerCase().includes(searchLower)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((topic) => {
        if (statusFilter === "behind") return topic.daysLag > 0;
        if (statusFilter === "ahead") return topic.daysLag < 0;
        if (statusFilter === "on_track") return topic.daysLag === 0;
        return topic.status === statusFilter;
      });
    }

    return filtered;
  }, [topics, searchTerm, statusFilter]);

  return {
    topics,
    isLoading,
    filteredTopics,
    setSearchTerm,
    setStatusFilter,
    refresh: fetchTopicsData,
  };
};

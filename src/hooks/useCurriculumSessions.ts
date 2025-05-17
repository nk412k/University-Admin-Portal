import { useState, useEffect } from "react";
import { DailySession, SessionProgressStats } from "@/types/curriculum";
import {
  fetchSessions,
  getSessionProgressStats,
} from "@/utils/curriculumUtils";
import {
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
} from "date-fns";

interface UseCurriculumSessionsProps {
  sectionId?: string;
  subjectId?: string;
  initialDate?: Date;
}

interface UseCurriculumSessionsResult {
  sessions: DailySession[];
  filteredSessions: DailySession[];
  isLoading: boolean;
  stats: SessionProgressStats;
  currentMonth: Date;
  goToNextMonth: () => void;
  goToPreviousMonth: () => void;
  goToToday: () => void;
  setFilterDate: (date: Date | null) => void;
  filterDate: Date | null;
  refresh: () => Promise<void>;
}

export const useCurriculumSessions = ({
  sectionId,
  subjectId,
  initialDate = new Date(),
}: UseCurriculumSessionsProps = {}): UseCurriculumSessionsResult => {
  const [sessions, setSessions] = useState<DailySession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(initialDate);
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  const fetchSessionsData = async () => {
    setIsLoading(true);

    const fetchStartDate = format(startOfMonth(currentMonth), "yyyy-MM-dd");
    const fetchEndDate = format(endOfMonth(currentMonth), "yyyy-MM-dd");

    const data = await fetchSessions(
      sectionId,
      fetchStartDate,
      fetchEndDate,
      subjectId
    );
    setSessions(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSessionsData();
  }, [sectionId, subjectId, currentMonth]);

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const filteredSessions = filterDate
    ? sessions.filter(
        (session) => session.date === format(filterDate, "yyyy-MM-dd")
      )
    : sessions;

  const stats = getSessionProgressStats(sessions);

  return {
    sessions,
    filteredSessions,
    isLoading,
    stats,
    currentMonth,
    goToNextMonth,
    goToPreviousMonth,
    goToToday,
    setFilterDate,
    filterDate,
    refresh: fetchSessionsData,
  };
};

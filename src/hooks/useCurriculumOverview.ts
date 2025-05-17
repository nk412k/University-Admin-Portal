
import { useState, useEffect } from 'react';
import { CurriculumProgress } from '@/types/curriculum';
import { calculateCurriculumProgress } from '@/utils/curriculumUtils';

interface UseCurriculumOverviewProps {
  sectionId?: string;
  subjectId?: string;
}

interface UseCurriculumOverviewResult {
  progressData: CurriculumProgress[];
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export const useCurriculumOverview = ({
  sectionId,
  subjectId,
}: UseCurriculumOverviewProps = {}): UseCurriculumOverviewResult => {
  const [progressData, setProgressData] = useState<CurriculumProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProgressData = async () => {
    setIsLoading(true);
    const data = await calculateCurriculumProgress(sectionId, subjectId);
    setProgressData(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProgressData();
  }, [sectionId, subjectId]);

  return {
    progressData,
    isLoading,
    refresh: fetchProgressData,
  };
};

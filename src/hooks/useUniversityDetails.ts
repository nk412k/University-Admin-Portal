
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

type UniversityDetails = {
  university_id: string;
  university_name: string;
  number_of_sections: number;
  number_of_students: number;
}

export const useUniversityDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [universityDetails, setUniversityDetails] = useState<UniversityDetails[]>([]);

  useEffect(() => {
    const fetchUniversityDetails = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .rpc('get_university_details');
        
        if (error) throw error;
        
        setUniversityDetails(data || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load university details:", error);
        toast({
          title: "Failed to load university details",
          description: "An error occurred while loading university data",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };

    fetchUniversityDetails();
  }, []);

  return { universityDetails, isLoading };
};

import { useState, useEffect } from "react";
import { Section } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useSections = (universityId?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setIsLoading(true);

        const query = supabase.from("sections").select("*");

        if (universityId) {
          query.eq("university_id", universityId);
        }

        const { data: sectionsData, error: sectionsError } = await query;

        if (sectionsError) throw sectionsError;

        const mappedSections = sectionsData.map((s) => ({
          section_id: s.section_id,
          name: s.name,
          university_id: s.university_id,
          department: s.department,
          year: s.year,
          created_at: s.created_at,
          id: s.section_id,
          updated_at: s.created_at,
        }));

        setSections(mappedSections);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load sections:", error);
        toast({
          title: "Failed to load sections",
          description: "An error occurred while loading sections",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchSections();
  }, [universityId]);

  return { sections, isLoading };
};

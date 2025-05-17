import { useState, useEffect } from "react";
import { Subject, Section } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useSubjects = (sections: Section[]) => {
  const [isLoading, setIsLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    if (!sections.length) return;

    const fetchSubjects = async () => {
      try {
        setIsLoading(true);

        const { data: subjectsData, error: subjectsError } = await supabase
          .from("subjects")
          .select("*");

        if (subjectsError) throw subjectsError;

        const mappedSubjects = subjectsData.map((s) => ({
          subject_id: s.subject_id,
          name: s.name,
          section_id: s.section_id,
          semester: s.semester,
          credits: s.credits,
          created_at: s.created_at,
          id: s.subject_id,
          code: `S${s.subject_id.substring(0, 4)}`,
          university_id:
            sections.find((sec) => sec.section_id === s.section_id)
              ?.university_id || "",
          updated_at: s.created_at,
        }));

        setSubjects(mappedSubjects);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load subjects:", error);
        toast({
          title: "Failed to load subjects",
          description: "An error occurred while loading subjects",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, [sections]);

  return { subjects, isLoading };
};

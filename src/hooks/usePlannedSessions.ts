import { useState, useEffect } from "react";
import { Slot } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const usePlannedSessions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [plannedSessions, setPlannedSessions] = useState<Slot[]>([]);

  useEffect(() => {
    const fetchPlannedSessions = async () => {
      try {
        setIsLoading(true);

        const { data, error } = await supabase
          .from("slots")
          .select(
            `
            *,
            sections(name),
            responsible:responsible_person(name)
          `
          )
          .order("start_datetime", { ascending: true });

        if (error) {
          throw error;
        }

        if (data) {
          const transformedData: Slot[] = data.map((slot) => ({
            id: slot.slot_id,
            slot_id: slot.slot_id,
            slot_type: slot.slot_type,
            slot_name: slot.slot_name,
            section_id: slot.section_id,
            university_id: slot.university_id,
            subject_id: undefined,
            start_datetime: slot.start_datetime,
            end_datetime: slot.end_datetime,
            topic: slot.topic || slot.slot_name,
            responsible_person: slot.responsible?.name || "Unassigned",
            created_at: slot.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
            section_name: slot.sections?.name,
            subject_name: undefined,
            session_type: slot.slot_type,
            date: slot.start_datetime,
            end_date: slot.end_datetime,
          }));

          setPlannedSessions(transformedData);
        } else {
          console.log("No data returned from the query");
          setPlannedSessions([]);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load planned sessions:", error);
        toast({
          title: "Failed to load sessions",
          description: "An error occurred while loading academic sessions",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchPlannedSessions();
  }, []);

  return { plannedSessions, isLoading };
};

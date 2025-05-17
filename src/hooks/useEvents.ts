import { useState, useEffect, useCallback } from "react";
import { Event, EventStatus } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useEvents = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);

      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .order("start_datetime", { ascending: true });

      if (eventsError) throw eventsError;

      const mappedEvents = eventsData.map((e) => {
        const mappedStatus: EventStatus = e.status;

        const event: Event = {
          event_id: e.event_id,
          name: e.name,
          venue: e.venue,
          start_datetime: e.start_datetime,
          end_datetime: e.end_datetime,
          status: mappedStatus,
          poc: e.poc,
          event_type: e.event_type,
          university_id: e.university_id || null,
          section_id: e.section_id || null,
          user_id: e.user_id || null,
          created_at: e.created_at,
          is_daily_checklist: e.is_daily_checklist || false,
          id: e.event_id,
          title: e.name,
          description: null,
          start_time: e.start_datetime,
          end_time: e.end_datetime,
          location: e.venue,
          poc_employee_id: e.poc || null,
          updated_at: e.created_at,
        };

        return event;
      });

      console.log("Fetched events:", mappedEvents.length);
      setEvents(mappedEvents);
    } catch (error) {
      console.error("Failed to load events:", error);
      toast({
        title: "Failed to load events",
        description: "An error occurred while loading events",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, isLoading, refetchEvents: fetchEvents };
};

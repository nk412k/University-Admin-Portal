import { useState, useEffect } from "react";
import { Holiday } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

export const useHolidays = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        setIsLoading(true);

        const today = new Date();
        const todayStr = format(today, "yyyy-MM-dd");

        const { data: holidaysData, error: holidaysError } = await supabase
          .from("holidays")
          .select("*")
          .gte("date", todayStr)
          .order("date", { ascending: true });

        if (holidaysError) throw holidaysError;

        const mappedHolidays: Holiday[] = holidaysData.map((h) => ({
          holiday_id: h.holiday_id,
          name: h.name,
          date: h.date,
          university_id: h.university_id,
          created_at: h.created_at,
        }));

        setHolidays(mappedHolidays);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load holidays:", error);
        toast({
          title: "Failed to load holidays",
          description: "An error occurred while loading holidays",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchHolidays();
  }, []);

  return { holidays, isLoading };
};

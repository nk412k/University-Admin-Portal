import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { University } from "@/types";
import { toast } from "@/hooks/use-toast";

export function useUniversities() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUniversities() {
      try {
        setIsLoading(true);

        const { data, error } = await supabase.from("universities").select("*");

        if (error) {
          throw error;
        }

        const mappedUniversities: University[] = data.map((uni) => ({
          id: uni.university_id,
          university_id: uni.university_id,
          name: uni.name,
          location: uni.location,
          established_year: uni.established_year,
          created_at: uni.created_at,
          code: uni.university_id,
          address: uni.location,
        }));

        setUniversities(mappedUniversities);
      } catch (error) {
        console.error("Error fetching universities:", error);
        setError("Failed to load universities data");
        toast({
          title: "Error",
          description: "Failed to load universities data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchUniversities();
  }, []);

  return { universities, isLoading, error };
}

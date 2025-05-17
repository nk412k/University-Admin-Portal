import React, { createContext, useContext, useState, useEffect } from "react";
import { University } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UniversityContextType {
  activeUniversity: University | null;
  setActiveUniversity: (university: University | null) => void;
  availableUniversities: University[];
  isLoading: boolean;
}

const UniversityContext = createContext<UniversityContextType | undefined>(
  undefined
);

export const useUniversity = () => {
  const context = useContext(UniversityContext);
  if (context === undefined) {
    throw new Error("useUniversity must be used within a UniversityProvider");
  }
  return context;
};

export const UniversityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeUniversity, setActiveUniversity] = useState<University | null>(
    null
  );
  const [availableUniversities, setAvailableUniversities] = useState<
    University[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setIsLoading(true);

        const { data, error } = await supabase.from("universities").select("*");

        if (error) throw error;

        if (data && data.length > 0) {
          const mappedUniversities = data.map((u) => ({
            university_id: u.university_id,
            name: u.name,
            location: u.location,
            established_year: u.established_year,
            created_at: u.created_at,
            id: u.university_id,
            code: u.name.substring(0, 3).toUpperCase(),
            address: u.location,
            updated_at: u.created_at,
          }));

          setAvailableUniversities(mappedUniversities);

          if (!activeUniversity && mappedUniversities.length > 0) {
            setActiveUniversity(mappedUniversities[0]);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load universities:", error);
        toast({
          title: "Failed to load universities",
          description: "An error occurred while loading the universities",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  return (
    <UniversityContext.Provider
      value={{
        activeUniversity,
        setActiveUniversity,
        availableUniversities,
        isLoading,
      }}
    >
      {children}
    </UniversityContext.Provider>
  );
};

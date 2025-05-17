import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Employee } from "@/types";
import { toast } from "@/hooks/use-toast";

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        setIsLoading(true);

        const { data, error } = await supabase.from("users").select("*");

        if (error) {
          throw error;
        }

        const mappedEmployees: Employee[] = data.map((user) => ({
          id: user.user_id,
          employee_id: user.user_id,
          full_name: user.full_name || user.name,
          role: user.role,
          university_id: "",
          email: user.email,
          is_instructor: user.role === "instructor",
          is_mentor: user.role === "mentor",
          created_at: user.created_at,
          updated_at: user.updated_at,
          position: user.role?.replace("_", " ") || "",
          department: "",
        }));

        setEmployees(mappedEmployees);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError("Failed to load employees data");
        toast({
          title: "Error",
          description: "Failed to load employees data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchEmployees();
  }, []);

  return { employees, isLoading, error };
}

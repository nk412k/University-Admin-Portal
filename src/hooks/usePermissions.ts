import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { UserRole } from "@/types";

type FeaturePermissionRole = Extract<
  UserRole,
  "central_admin" | "instructor" | "mentor" | "event_manager" | "college_admin"
>;

interface Permissions {
  role?: UserRole;
  dashboard: boolean;
  curriculum: boolean;
  students: boolean;
  academics: boolean;
  employees: boolean;
  teaching_hours: boolean;
  events: boolean;
  announcements: boolean;
  feedback: boolean;
  alerts: boolean;
  reports: boolean;
}

export const usePermissions = () => {
  const { user, profile } = useAuth();
  const [permissions, setPermissions] = useState<Permissions | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user || !profile) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: funcData, error: funcError } = await supabase.rpc(
          "get_user_permissions",
          { user_id: profile.id }
        );

        if (funcData) {
          const permissionsData = Array.isArray(funcData)
            ? funcData.find((item) => item.role === profile.role)
            : funcData;
          setPermissions(permissionsData as Permissions);
        } else if (funcError) {
          console.error("Error fetching permissions with RPC:", funcError);

          if (isFeaturePermissionRole(profile.role)) {
            const { data, error } = await supabase
              .from("feature_permissions")
              .select("*")
              .eq("role", profile.role as FeaturePermissionRole)
              .single();

            if (error) {
              console.error("Error fetching permissions:", error);
              setDefaultPermissions(profile.role);
            } else if (data) {
              setPermissions(data as Permissions);
            }
          } else {
            setDefaultPermissions(profile.role);
          }
        }
      } catch (error) {
        console.error("Unexpected error fetching permissions:", error);
        setDefaultPermissions(profile.role);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, [user, profile]);

  const isFeaturePermissionRole = (
    role: UserRole
  ): role is FeaturePermissionRole => {
    return [
      "central_admin",
      "instructor",
      "mentor",
      "event_manager",
      "college_admin",
    ].includes(role as string);
  };

  const setDefaultPermissions = (role: UserRole) => {
    toast({
      title: "Error loading permissions",
      description:
        "Your permissions could not be loaded. Default permissions have been applied.",
      variant: "destructive",
    });

    if (role === "college_admin") {
      setPermissions({
        role: role,
        dashboard: true,
        curriculum: true,
        students: true,
        academics: true,
        employees: true,
        teaching_hours: true,
        events: true,
        announcements: true,
        feedback: true,
        alerts: true,
        reports: true,
      });
    } else {
      setPermissions({
        role: role,
        dashboard: true,
        curriculum: false,
        students: false,
        academics: false,
        employees: false,
        teaching_hours: false,
        events: role === "event_manager",
        announcements: false,
        feedback: false,
        alerts: false,
        reports: false,
      });
    }
  };

  return { permissions, isLoading };
};

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AnnouncementWithTargets } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { PostgrestError } from "@supabase/supabase-js";

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementWithTargets[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: activeAnnouncementsData, error: activeAnnouncementsError } =
        await supabase.from("active_announcements").select("*");

      if (activeAnnouncementsError) throw activeAnnouncementsError;

      let allAnnouncements = [...(activeAnnouncementsData || [])];

      if (profile?.role === "college_admin" || profile?.role === "mentor") {
        if (activeAnnouncementsData && activeAnnouncementsData.length > 0) {
          const { data: allAnnouncementsData, error: allAnnouncementsError } =
            await supabase.from("announcements").select("*");

          if (allAnnouncementsError) throw allAnnouncementsError;

          const activeIds = new Set(
            activeAnnouncementsData.map((a) => a.announcement_id)
          );
          const inactiveAnnouncementsData =
            allAnnouncementsData?.filter(
              (a) => !activeIds.has(a.announcement_id)
            ) || [];

          allAnnouncements = [
            ...allAnnouncements,
            ...inactiveAnnouncementsData,
          ];
        } else {
          const {
            data: inactiveAnnouncementsData,
            error: inactiveAnnouncementsError,
          } = await supabase.from("announcements").select("*");

          if (inactiveAnnouncementsError) throw inactiveAnnouncementsError;

          allAnnouncements = [
            ...allAnnouncements,
            ...(inactiveAnnouncementsData || []),
          ];
        }
      }

      const announcementIds = allAnnouncements.map((a) => a.announcement_id);

      const { data: targetsData, error: targetsError } = await supabase
        .from("announcement_targets")
        .select("*")
        .in("announcement_id", announcementIds);

      if (targetsError) throw targetsError;

      const { data: readsData, error: readsError } = await supabase
        .from("announcement_reads")
        .select("*")
        .in("announcement_id", announcementIds)
        .eq("user_id", user?.id);

      if (readsError) throw readsError;

      const announcementsWithTargets = allAnnouncements.map((announcement) => {
        const targets =
          targetsData
            ?.filter(
              (target) =>
                target.announcement_id === announcement.announcement_id
            )
            .map((target) => ({
              ...target,
              target_type: target.target_type as
                | "university"
                | "section"
                | "role",
            })) || [];

        const isRead =
          readsData?.some(
            (read) => read.announcement_id === announcement.announcement_id
          ) || false;

        return {
          ...announcement,
          targets,
          read_status: isRead,
        } as AnnouncementWithTargets;
      });

      setAnnouncements(announcementsWithTargets);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof PostgrestError
          ? error.message
          : error instanceof Error
          ? error.message
          : "Unknown error occurred";

      console.error("Error fetching announcements:", error);
      setError(errorMessage);
      toast({
        title: "Error fetching announcements",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createAnnouncement = async (
    title: string,
    content: string,
    publishFrom: Date,
    publishUntil: Date | null,
    targets: {
      type: "university" | "section" | "role";
      value: string;
    }[]
  ) => {
    try {
      if (!user) throw new Error("User not authenticated");

      const hardcodedProfileId = "26a4267d-7093-436e-b637-2d42c8df13f2";

      const { data: announcementData, error: announcementError } =
        await supabase
          .from("announcements")
          .insert({
            title,
            content,
            created_by: hardcodedProfileId,
            publish_from: publishFrom.toISOString(),
            publish_until: publishUntil ? publishUntil.toISOString() : null,
          })
          .select()
          .single();

      if (announcementError) throw announcementError;
      if (!announcementData) throw new Error("Failed to create announcement");

      toast({
        title: "Announcement created",
        description: "Your announcement has been created successfully",
      });

      try {
        if (targets.length > 0) {
          const targetInserts = targets.map((target) => ({
            announcement_id: announcementData.announcement_id,
            target_type: target.type,
            target_id_value: target.type !== "role" ? target.value : null,
            target_role: target.type === "role" ? target.value : null,
          }));

          const { error: targetsError } = await supabase
            .from("announcement_targets")
            .insert(targetInserts);

          if (targetsError) {
            console.error(
              "Error inserting announcement targets:",
              targetsError
            );
          }
        }
      } catch (targetError) {
        console.error("Error handling targets:", targetError);
      }

      setIsLoading(true);

      fetchAnnouncements();

      return { success: true };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof PostgrestError
          ? error.message
          : error instanceof Error
          ? error.message
          : "Unknown error occurred";

      console.error("Error creating announcement:", error);
      toast({
        title: "Error creating announcement",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  };

  const markAnnouncementAsRead = async (announcementId: string) => {
    try {
      console.log("Marking announcement as read (UI only):", announcementId);

      setAnnouncements((prev) =>
        prev.map((announcement) =>
          announcement.announcement_id === announcementId
            ? { ...announcement, read_status: true }
            : announcement
        )
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof PostgrestError
          ? error.message
          : error instanceof Error
          ? error.message
          : "Unknown error occurred";

      console.error("Error marking announcement as read:", errorMessage);
    }
  };

  const toggleAnnouncementActive = async (
    announcementId: string,
    isActive: boolean
  ) => {
    try {
      const { error } = await supabase
        .from("announcements")
        .update({ is_active: isActive })
        .eq("announcement_id", announcementId);

      if (error) throw error;

      setAnnouncements((prev) =>
        prev.map((announcement) =>
          announcement.announcement_id === announcementId
            ? { ...announcement, is_active: isActive }
            : announcement
        )
      );

      toast({
        title: isActive ? "Announcement activated" : "Announcement deactivated",
        description: `The announcement has been ${
          isActive ? "activated" : "deactivated"
        } successfully`,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof PostgrestError
          ? error.message
          : error instanceof Error
          ? error.message
          : "Unknown error occurred";

      console.error("Error toggling announcement active status:", error);
      toast({
        title: "Error updating announcement",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchAnnouncements();
    }
  }, [user]);

  return {
    announcements,
    isLoading,
    error,
    fetchAnnouncements,
    createAnnouncement,
    markAnnouncementAsRead,
    toggleAnnouncementActive,
  };
};

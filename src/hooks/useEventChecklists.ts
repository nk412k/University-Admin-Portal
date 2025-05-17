import { useState, useEffect } from "react";
import {
  EventChecklist,
  ChecklistItem,
  EventChecklistItemStatus,
} from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface Checklist {
  checklist_id: string;
  created_at: string;
  type: "exam" | "class" | "guest_lecture" | "daily_test" | "daily";
  items: any;
}

export interface ChecklistDataItem extends ChecklistItem {
  status?: EventChecklistItemStatus | null;
}

export interface ChecklistData {
  eventId: string;
  checklist: Checklist | null;
  eventChecklist: EventChecklist | null;
  items: ChecklistDataItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useEventChecklist = (eventId: string): ChecklistData => {
  const [data, setData] = useState<Omit<ChecklistData, "refetch">>({
    eventId,
    checklist: null,
    eventChecklist: null,
    items: [],
    isLoading: true,
    error: null,
  });

  const fetchEventChecklistData = async () => {
    setData((prev) => ({ ...prev, isLoading: true, error: null }));

    if (!eventId) {
      setData((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      // Get the event checklist
      const { data: eventChecklistData, error: eventChecklistError } =
        await supabase
          .from("event_checklists")
          .select("*")
          .eq("event_id", eventId)
          .single();

      if (eventChecklistError) {
        throw eventChecklistError;
      }

      if (!eventChecklistData) {
        setData((prev) => ({
          ...prev,
          isLoading: false,
          error: "No checklist found for this event",
        }));
        return;
      }

      const { data: checklistData, error: checklistError } = await supabase
        .from("checklists")
        .select("*")
        .eq("checklist_id", eventChecklistData.checklist_id)
        .single();

      if (checklistError) {
        throw checklistError;
      }

      const { data: checklistMappingData, error: mappingError } = await supabase
        .from("checklist_item_mapping")
        .select("*")
        .eq("checklist_id", checklistData.checklist_id);

      if (mappingError) {
        throw mappingError;
      }

      const itemIds = checklistMappingData.map((mapping) => mapping.item_id);

      if (itemIds.length === 0) {
        setData({
          eventId,
          checklist: checklistData as Checklist,
          eventChecklist: eventChecklistData,
          items: [],
          isLoading: false,
          error: null,
        });
        return;
      }

      const { data: checklistItemsData, error: checklistItemsError } =
        await supabase
          .from("checklist_items")
          .select("*")
          .in("item_id", itemIds);

      if (checklistItemsError) {
        throw checklistItemsError;
      }

      const { data: itemStatusData, error: itemStatusError } = await supabase
        .from("event_checklist_item_status")
        .select("*")
        .eq("event_id", eventId)
        .eq("checklist_id", checklistData.checklist_id);

      if (itemStatusError) {
        throw itemStatusError;
      }

      const itemsWithStatus: ChecklistDataItem[] = checklistItemsData.map(
        (item) => {
          const status = itemStatusData.find(
            (status) => status.item_id === item.item_id
          );

          const mapping = checklistMappingData.find(
            (mapping) => mapping.item_id === item.item_id
          );

          return {
            ...item,
            checklist_id: mapping ? mapping.checklist_id : undefined,
            status: status || null,
          };
        }
      );

      setData({
        eventId,
        checklist: checklistData as Checklist,
        eventChecklist: eventChecklistData,
        items: itemsWithStatus,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error("Error fetching event checklist data:", error);
      setData((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || "Error fetching checklist data",
      }));
      toast({
        title: "Error fetching checklist",
        description: error.message || "Could not load checklist data",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchEventChecklistData();
  }, [eventId]);

  return {
    ...data,
    refetch: fetchEventChecklistData,
  };
};

export const updateChecklistItemStatus = async (
  statusId: string,
  newStatus: EventChecklistItemStatus["status"],
  remarks?: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("event_checklist_item_status")
      .update({
        status: newStatus,
        remarks,
        updated_at: new Date().toISOString(),
      })
      .eq("status_id", statusId);

    if (error) {
      throw error;
    }

    toast({
      title: "Status updated",
      description: "The checklist item status has been updated.",
    });

    return true;
  } catch (error: any) {
    console.error("Error updating checklist item status:", error);
    toast({
      title: "Update failed",
      description: error.message || "Could not update item status",
      variant: "destructive",
    });
    return false;
  }
};

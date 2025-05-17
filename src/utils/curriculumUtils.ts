import { parseISO, isAfter, differenceInDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import {
  CurriculumTopic,
  DailySession,
  CurriculumProgress,
  SessionStatus,
  SessionProgressStats,
  SessionSlot,
} from "@/types/curriculum";
import { toast } from "@/components/ui/use-toast";

const getSlotDetails = (
  sessionNumber: number
): { slot: SessionSlot; startTime: string; endTime: string } => {
  switch (sessionNumber) {
    case 1:
      return { slot: "slot1", startTime: "9:00 AM", endTime: "10:00 AM" };
    case 2:
      return { slot: "slot2", startTime: "10:15 AM", endTime: "11:15 AM" };
    case 3:
      return { slot: "slot3", startTime: "11:30 AM", endTime: "12:30 PM" };
    case 4:
      return { slot: "slot4", startTime: "1:30 PM", endTime: "2:30 PM" };
    case 5:
      return { slot: "slot5", startTime: "2:45 PM", endTime: "3:45 PM" };
    case 6:
      return { slot: "slot6", startTime: "4:00 PM", endTime: "5:00 PM" };
    case 7:
      return { slot: "slot7", startTime: "5:15 PM", endTime: "6:15 PM" };
    default:
      return { slot: "slot1", startTime: "9:00 AM", endTime: "10:00 AM" };
  }
};

export const getSessionStatus = (
  scheduledDate: string,
  completionStatus?: string,
  completionPercentage?: number
): SessionStatus => {
  const today = new Date();
  const parsedScheduledDate = parseISO(scheduledDate);

  if (completionStatus === "completed") {
    return "completed";
  }

  if (completionStatus === "in_progress") {
    return "in_progress";
  }

  if (completionStatus === "rescheduled") {
    return "rescheduled";
  }

  if (
    isAfter(today, parsedScheduledDate) &&
    (!completionStatus || completionStatus === "pending")
  ) {
    return "overdue";
  }

  return "pending";
};

export const fetchSessions = async (
  sectionId?: string,
  startDate?: string,
  endDate?: string,
  subjectId?: string
): Promise<DailySession[]> => {
  try {
    let query = supabase
      .from("curriculum_scheduled_topics")
      .select(
        `
        id,
        scheduled_date,
        session_number,
        topic_name,
        section_id,
        sections(name),
        subject_id,
        subjects(name),
        duration_minutes,
        curriculum_actual_progress(actual_date, completion_status, completion_percentage)
      `
      )
      .order("scheduled_date", { ascending: true })
      .order("session_number", { ascending: true });

    if (sectionId && sectionId !== "all") {
      query = query.eq("section_id", sectionId);
    }

    if (subjectId && subjectId !== "all") {
      query = query.eq("subject_id", subjectId);
    }

    if (startDate) {
      query = query.gte("scheduled_date", startDate);
    }

    if (endDate) {
      query = query.lte("scheduled_date", endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching sessions:", error.message);
      toast({
        title: "Error",
        description: "Failed to fetch session data.",
        variant: "destructive",
      });
      return [];
    }

    return (data || []).map((session) => {
      const { slot, startTime, endTime } = getSlotDetails(
        session.session_number
      );

      const progress = session.curriculum_actual_progress?.[0];
      const status = getSessionStatus(
        session.scheduled_date,
        progress?.completion_status,
        progress?.completion_percentage
      );

      return {
        id: session.id,
        date: session.scheduled_date,
        sectionId: session.section_id,
        sectionName: session.sections?.name || "Unknown Section",
        slot,
        sessionNumber: session.session_number,
        startTime,
        endTime,
        topicName: session.topic_name,
        subjectId: session.subject_id,
        subjectName: session.subjects?.name || "Unknown Subject",
        status,
        completionPercentage: progress?.completion_percentage,
      };
    });
  } catch (error) {
    console.error("Error in fetchSessions:", error);
    toast({
      title: "Error",
      description: "An unexpected error occurred while fetching sessions.",
      variant: "destructive",
    });
    return [];
  }
};

export const fetchTopics = async (
  sectionId?: string,
  subjectId?: string
): Promise<CurriculumTopic[]> => {
  try {
    let query = supabase.from("curriculum_scheduled_topics").select(`
        id,
        scheduled_date,
        topic_name,
        section_id,
        sections(name),
        subject_id,
        subjects(name),
        curriculum_actual_progress(actual_date, completion_status, completion_percentage)
      `);

    if (sectionId && sectionId !== "all") {
      query = query.eq("section_id", sectionId);
    }

    if (subjectId && subjectId !== "all") {
      query = query.eq("subject_id", subjectId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching topics:", error.message);
      toast({
        title: "Error",
        description: "Failed to fetch topic data.",
        variant: "destructive",
      });
      return [];
    }

    return data.map((item) => {
      const progress = item.curriculum_actual_progress?.[0];
      const completedDate = progress?.actual_date;

      let daysLag = 0;
      if (progress?.completion_status === "completed" && completedDate) {
        daysLag = differenceInDays(
          parseISO(completedDate),
          parseISO(item.scheduled_date)
        );
      } else if (
        progress?.completion_status === "overdue" ||
        (!progress?.completion_status &&
          isAfter(new Date(), parseISO(item.scheduled_date)))
      ) {
        daysLag = differenceInDays(new Date(), parseISO(item.scheduled_date));
      }

      const status = getSessionStatus(
        item.scheduled_date,
        progress?.completion_status,
        progress?.completion_percentage
      );

      return {
        id: item.id,
        name: item.topic_name,
        subjectId: item.subject_id,
        subjectName: item.subjects?.name || "Unknown Subject",
        sectionId: item.section_id,
        sectionName: item.sections?.name || "Unknown Section",
        deadline: item.scheduled_date,
        completedDate,
        status,
        daysLag,
        completionPercentage: progress?.completion_percentage || 0,
      };
    });
  } catch (error) {
    console.error("Error in fetchTopics:", error);
    toast({
      title: "Error",
      description: "An unexpected error occurred while fetching topics.",
      variant: "destructive",
    });
    return [];
  }
};

export const calculateCurriculumProgress = async (
  sectionId?: string,
  subjectId?: string
): Promise<CurriculumProgress[]> => {
  try {
    let query = supabase.from("curriculum_progress_stats").select("*");

    if (sectionId && sectionId !== "all") {
      query = query.eq("section_id", sectionId);
    }

    if (subjectId && subjectId !== "all") {
      query = query.eq("subject_id", subjectId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching curriculum progress:", error.message);
      return [];
    }

    return (data || []).map((stat) => {
      const totalTopics = stat.total_scheduled_topics || 0;
      const completedTopics = stat.completed_topics || 0;
      const behindScheduleTopics = stat.behind_topics || 0;
      const aheadOfScheduleTopics = stat.ahead_topics || 0;
      const onScheduleTopics =
        completedTopics - behindScheduleTopics - aheadOfScheduleTopics;
      const averageLagDays = stat.avg_days_variance || 0;

      let overallStatus: "on_track" | "behind" | "ahead" = "on_track";
      if (averageLagDays > 2) {
        overallStatus = "behind";
      } else if (averageLagDays < -2) {
        overallStatus = "ahead";
      }

      return {
        sectionId: stat.section_id,
        sectionName: stat.section_name || "Unknown Section",
        subjectId: stat.subject_id,
        subjectName: stat.subject_name || "Unknown Subject",
        totalTopics,
        completedTopics,
        onScheduleTopics,
        behindScheduleTopics,
        aheadOfScheduleTopics,
        overallStatus,
        averageLagDays,
      };
    });
  } catch (error) {
    console.error("Error in calculateCurriculumProgress:", error);
    toast({
      title: "Error",
      description:
        "An unexpected error occurred while calculating curriculum progress.",
      variant: "destructive",
    });
    return [];
  }
};

export const getSessionProgressStats = (
  sessions: DailySession[]
): SessionProgressStats => {
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(
    (s) => s.status === "completed"
  ).length;
  const overdueSessions = sessions.filter((s) => s.status === "overdue").length;
  const pendingSessions = totalSessions - completedSessions - overdueSessions;
  const completionPercentage =
    totalSessions > 0
      ? Math.round((completedSessions / totalSessions) * 100)
      : 0;

  return {
    totalSessions,
    completedSessions,
    pendingSessions,
    overdueSessions,
    completionPercentage,
  };
};

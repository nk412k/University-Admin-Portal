export type SessionSlot =
  | "slot1"
  | "slot2"
  | "slot3"
  | "slot4"
  | "slot5"
  | "slot6"
  | "slot7";
export type SessionStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "overdue"
  | "rescheduled";

export interface CurriculumTopic {
  id: string;
  name: string;
  subjectId: string;
  subjectName: string;
  sectionId: string;
  sectionName: string;
  deadline: string;
  completedDate?: string;
  status: SessionStatus;
  daysLag: number;
  completionPercentage?: number;
}

export interface DailySession {
  id: string;
  date: string;
  sectionId: string;
  sectionName: string;
  slot: SessionSlot;
  sessionNumber: number;
  startTime: string;
  endTime: string;
  topicName: string;
  subjectId: string;
  subjectName: string;
  instructorId?: string;
  instructorName?: string;
  status: SessionStatus;
  completionPercentage?: number;
}

export interface CurriculumProgress {
  sectionId: string;
  sectionName: string;
  subjectId?: string;
  subjectName?: string;
  totalTopics: number;
  completedTopics: number;
  onScheduleTopics: number;
  behindScheduleTopics: number;
  aheadOfScheduleTopics: number;
  overallStatus: "on_track" | "behind" | "ahead";
  averageLagDays: number;
}

export interface SessionProgressStats {
  totalSessions: number;
  completedSessions: number;
  pendingSessions: number;
  overdueSessions: number;
  completionPercentage: number;
}

export interface SubjectProgress {
  subjectId: string;
  subjectName: string;
  sectionId: string;
  sectionName: string;
  totalSessions: number;
  completedSessions: number;
  pendingSessions: number;
  overdueSessions: number;
  completionPercentage: number;
}

export type UserRole =
  | "central_admin"
  | "instructor"
  | "mentor"
  | "event_manager"
  | "college_admin";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  university_id: string | null;
  section_id: string | null;
  created_at: string;
  updated_at: string;
}

export type RiskLevel = "low" | "medium" | "high";

export interface Student {
  student_id: string;
  section_id: string;
  name: string;
  email: string;
  roll_number: string;
  joining_year: number;
  current_semester: number;
  enrollment_year: number;
  cgpa: number | null;
  created_at?: string;
  risk_level?: RiskLevel;
  risk_score?: number;
  exam_pass_rate?: number;
  attendance_percentage?: number;
  section_name?: string;
  id?: string;
  full_name?: string;
  university_id?: string;
  enrollment_date?: string;
  contact_number?: string;
  updated_at?: string;
}

export interface University {
  university_id: string;
  name: string;
  location: string;
  established_year: number;
  created_at?: string;
  id?: string;
  code?: string;
  address?: string;
  updated_at?: string;
}

export interface Section {
  section_id: string;
  university_id: string;
  name: string;
  department: string;
  year: number;
  created_at?: string;
  id?: string;
  updated_at?: string;
}

export interface Subject {
  subject_id: string;
  section_id: string;
  name: string;
  semester: number;
  credits: number;
  created_at?: string;
  id?: string;
  code?: string;
  university_id?: string;
  updated_at?: string;
}

export interface Slot {
  id?: string;
  slot_id: string;
  slot_type: "exam" | "learning_session" | "guest_lecture" | "topic_discussion";
  slot_name: string;
  section_id: string;
  subject_id?: string;
  university_id?: string;
  responsible_person: string;
  linked_event_id?: string | null;
  linked_topic_id?: string | null;
  start_datetime: string | null;
  end_datetime: string | null;
  topic?: string;
  created_at?: string;
  updated_at?: string;
  section_name?: string;
  subject_name?: string;
  event_name?: string;
  event_venue?: string;
  topic_name?: string;
  topic_duration?: number;
  session_type?: string;

  date?: string | null;
  end_date?: string | null;
}

export type EventStatus = "planned" | "ongoing" | "completed";

export type EventType =
  | "section_specific"
  | "university_specific"
  | "user_specific";

export interface Event {
  event_id: string;
  name: string;
  venue: string;
  start_datetime: string;
  end_datetime: string;
  status: EventStatus;
  poc: string;
  event_type: EventType;
  university_id?: string | null;
  section_id?: string | null;
  user_id?: string | null;
  created_at?: string;
  is_daily_checklist?: boolean;
  id?: string;
  title?: string;
  description?: string | null;
  start_time?: string;
  end_time?: string;
  location?: string;
  poc_employee_id?: string | null;
  created_by?: string | null;
  updated_at?: string;
}

export interface PlannedSession {
  id: string;
  subject_id: string;
  section_id: string;
  university_id: string;
  date: string;
  end_date?: string;
  topic: string;
  created_at: string;
  updated_at: string;
  section_name?: string;
  subject_name?: string;
  responsible_person?: string;
  session_type?: string;
}

export interface ActualSession {
  id: string;
  subject_id: string;
  section_id: string;
  university_id: string;
  date: string;
  topic: string;
  duration_minutes: number;
  attendance_percentage: number;
  created_at: string;
  updated_at: string;
  planned_session_id?: string;
  instructor_id?: string | null;
  notes?: string | null;
}

export interface Employee {
  id: string;
  employee_id: string;
  full_name: string;
  role: UserRole;
  university_id: string;
  email: string;
  is_instructor: boolean;
  is_mentor: boolean;
  created_at: string;
  updated_at: string;
  position?: string;
  department?: string;
  user_id?: string | null;
  joining_date?: string;
  contact_number?: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: "low" | "medium" | "high";
  category: "student" | "academic" | "facility" | "general";
  is_read: boolean;
  university_id: string;
  section_id?: string;
  created_at: string;
  updated_at: string;
  alert_type?: string;
  entity_type?: string | null;
  entity_id?: string | null;
}

export type ChecklistType =
  | "exam"
  | "class"
  | "guest_lecture"
  | "daily_test"
  | "daily";
export type ChecklistStatus = "completed" | "pending" | "in_progress";
export type ChecklistItemStatus = "completed" | "pending" | "in_progress";

export interface ChecklistItem {
  item_id: string;
  description: string;
  checklist_id?: string;
  created_at: string;
}

export interface EventChecklistItemStatus {
  status_id: string;
  event_id: string;
  checklist_id: string;
  item_id: string;
  status: ChecklistStatus;
  remarks?: string;
  updated_at: string;
  updated_by?: string;
}

export interface Checklist {
  checklist_id: string;
  type: string;
  items: Record<string, unknown>;
  created_at: string;
}

export interface EventChecklist {
  event_checklist_id: string;
  event_id: string;
  checklist_id: string;
  due_date: string;
  status: ChecklistStatus;
  remark?: string;
  created_at: string;
}

export interface Holiday {
  holiday_id: string;
  name: string;
  date: string;
  university_id: string;
  created_at: string;
}

export interface Announcement {
  announcement_id: string;
  title: string;
  content: string;
  created_by: string;
  created_at: string;
  publish_from: string;
  publish_until: string | null;
  is_active: boolean;
}

export interface AnnouncementTarget {
  target_id: string;
  announcement_id: string;
  target_type: "university" | "section" | "role";
  target_id_value: string | null;
  target_role: string | null;
  created_at: string;
}

export interface AnnouncementRead {
  read_id: string;
  announcement_id: string;
  user_id: string;
  read_at: string;
}

export type AnnouncementWithTargets = Announcement & {
  targets: AnnouncementTarget[];
  read_status?: boolean;
};

export interface StudentPayment {
  payment_id: string;
  student_id: string;
  semester: number;
  amount_paid: number;
  total_due: number;
  transaction_id: string;
  created_at: string;
  students?: {
    name: string;
  };
}

export interface User {
  user_id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
  auth_user_id?: string;
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      academic_sessions: {
        Row: {
          created_at: string | null
          date: string
          end_time: string
          id: string
          instructor_id: string | null
          instructor_name: string | null
          section_id: string | null
          section_name: string
          slot: string
          start_time: string
          status: string
          subject_id: string | null
          subject_name: string | null
          topic_id: string | null
          topic_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          end_time: string
          id?: string
          instructor_id?: string | null
          instructor_name?: string | null
          section_id?: string | null
          section_name: string
          slot: string
          start_time: string
          status: string
          subject_id?: string | null
          subject_name?: string | null
          topic_id?: string | null
          topic_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          end_time?: string
          id?: string
          instructor_id?: string | null
          instructor_name?: string | null
          section_id?: string | null
          section_name?: string
          slot?: string
          start_time?: string
          status?: string
          subject_id?: string | null
          subject_name?: string | null
          topic_id?: string | null
          topic_name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "academic_sessions_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "academic_sessions_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["section_id"]
          },
          {
            foreignKeyName: "academic_sessions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["subject_id"]
          },
          {
            foreignKeyName: "academic_sessions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["topic_id"]
          },
        ]
      }
      announcement_reads: {
        Row: {
          announcement_id: string
          read_at: string
          read_id: string
          user_id: string
        }
        Insert: {
          announcement_id: string
          read_at?: string
          read_id?: string
          user_id: string
        }
        Update: {
          announcement_id?: string
          read_at?: string
          read_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcement_reads_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "active_announcements"
            referencedColumns: ["announcement_id"]
          },
          {
            foreignKeyName: "announcement_reads_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["announcement_id"]
          },
          {
            foreignKeyName: "announcement_reads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      announcement_targets: {
        Row: {
          announcement_id: string
          created_at: string
          target_id: string
          target_id_value: string | null
          target_role: string | null
          target_type: string
        }
        Insert: {
          announcement_id: string
          created_at?: string
          target_id?: string
          target_id_value?: string | null
          target_role?: string | null
          target_type: string
        }
        Update: {
          announcement_id?: string
          created_at?: string
          target_id?: string
          target_id_value?: string | null
          target_role?: string | null
          target_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcement_targets_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "active_announcements"
            referencedColumns: ["announcement_id"]
          },
          {
            foreignKeyName: "announcement_targets_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["announcement_id"]
          },
        ]
      }
      announcements: {
        Row: {
          announcement_id: string
          content: string
          created_at: string
          created_by: string
          is_active: boolean
          publish_from: string
          publish_until: string | null
          title: string
        }
        Insert: {
          announcement_id?: string
          content: string
          created_at?: string
          created_by: string
          is_active?: boolean
          publish_from: string
          publish_until?: string | null
          title: string
        }
        Update: {
          announcement_id?: string
          content?: string
          created_at?: string
          created_by?: string
          is_active?: boolean
          publish_from?: string
          publish_until?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      checklist_item_mapping: {
        Row: {
          checklist_id: string
          created_at: string | null
          item_id: string
          mapping_id: string
        }
        Insert: {
          checklist_id: string
          created_at?: string | null
          item_id: string
          mapping_id?: string
        }
        Update: {
          checklist_id?: string
          created_at?: string | null
          item_id?: string
          mapping_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_item_mapping_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "checklists"
            referencedColumns: ["checklist_id"]
          },
          {
            foreignKeyName: "checklist_item_mapping_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "checklist_items"
            referencedColumns: ["item_id"]
          },
        ]
      }
      checklist_items: {
        Row: {
          created_at: string | null
          description: string
          item_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          item_id?: string
        }
        Update: {
          created_at?: string | null
          description?: string
          item_id?: string
        }
        Relationships: []
      }
      checklists: {
        Row: {
          checklist_id: string
          created_at: string | null
          items: Json
          type: Database["public"]["Enums"]["checklist_type"]
        }
        Insert: {
          checklist_id?: string
          created_at?: string | null
          items: Json
          type: Database["public"]["Enums"]["checklist_type"]
        }
        Update: {
          checklist_id?: string
          created_at?: string | null
          items?: Json
          type?: Database["public"]["Enums"]["checklist_type"]
        }
        Relationships: []
      }
      curriculum_actual_progress: {
        Row: {
          actual_date: string | null
          completion_percentage: number | null
          completion_status: string
          created_at: string | null
          id: string
          instructor_notes: string | null
          scheduled_topic_id: string | null
          updated_at: string | null
        }
        Insert: {
          actual_date?: string | null
          completion_percentage?: number | null
          completion_status: string
          created_at?: string | null
          id?: string
          instructor_notes?: string | null
          scheduled_topic_id?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_date?: string | null
          completion_percentage?: number | null
          completion_status?: string
          created_at?: string | null
          id?: string
          instructor_notes?: string | null
          scheduled_topic_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_actual_progress_scheduled_topic_id_fkey"
            columns: ["scheduled_topic_id"]
            isOneToOne: false
            referencedRelation: "curriculum_scheduled_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculum_scheduled_topics: {
        Row: {
          created_at: string | null
          duration_minutes: number
          id: string
          scheduled_date: string
          section_id: string
          session_number: number
          subject_id: string
          topic_name: string
        }
        Insert: {
          created_at?: string | null
          duration_minutes: number
          id?: string
          scheduled_date: string
          section_id: string
          session_number: number
          subject_id: string
          topic_name: string
        }
        Update: {
          created_at?: string | null
          duration_minutes?: number
          id?: string
          scheduled_date?: string
          section_id?: string
          session_number?: number
          subject_id?: string
          topic_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_scheduled_topics_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["section_id"]
          },
          {
            foreignKeyName: "curriculum_scheduled_topics_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["subject_id"]
          },
        ]
      }
      event_checklist_item_status: {
        Row: {
          checklist_id: string
          created_at: string | null
          event_id: string
          item_id: string
          remarks: string | null
          status: Database["public"]["Enums"]["checklist_status"]
          status_id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          checklist_id: string
          created_at?: string | null
          event_id: string
          item_id: string
          remarks?: string | null
          status?: Database["public"]["Enums"]["checklist_status"]
          status_id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          checklist_id?: string
          created_at?: string | null
          event_id?: string
          item_id?: string
          remarks?: string | null
          status?: Database["public"]["Enums"]["checklist_status"]
          status_id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_checklist_item_status_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "checklists"
            referencedColumns: ["checklist_id"]
          },
          {
            foreignKeyName: "event_checklist_item_status_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "event_checklist_item_status_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "checklist_items"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "event_checklist_item_status_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      event_checklists: {
        Row: {
          checklist_id: string
          created_at: string | null
          due_date: string
          event_checklist_id: string
          event_id: string
          remark: string | null
          status: Database["public"]["Enums"]["checklist_status"]
        }
        Insert: {
          checklist_id: string
          created_at?: string | null
          due_date: string
          event_checklist_id?: string
          event_id: string
          remark?: string | null
          status?: Database["public"]["Enums"]["checklist_status"]
        }
        Update: {
          checklist_id?: string
          created_at?: string | null
          due_date?: string
          event_checklist_id?: string
          event_id?: string
          remark?: string | null
          status?: Database["public"]["Enums"]["checklist_status"]
        }
        Relationships: [
          {
            foreignKeyName: "event_checklists_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "checklists"
            referencedColumns: ["checklist_id"]
          },
          {
            foreignKeyName: "event_checklists_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          end_datetime: string
          event_id: string
          event_type: Database["public"]["Enums"]["event_type"]
          is_daily_checklist: boolean | null
          name: string
          poc: string
          section_id: string | null
          start_datetime: string
          status: Database["public"]["Enums"]["event_status"]
          university_id: string | null
          user_id: string | null
          venue: string
        }
        Insert: {
          created_at?: string | null
          end_datetime: string
          event_id?: string
          event_type: Database["public"]["Enums"]["event_type"]
          is_daily_checklist?: boolean | null
          name: string
          poc: string
          section_id?: string | null
          start_datetime: string
          status?: Database["public"]["Enums"]["event_status"]
          university_id?: string | null
          user_id?: string | null
          venue: string
        }
        Update: {
          created_at?: string | null
          end_datetime?: string
          event_id?: string
          event_type?: Database["public"]["Enums"]["event_type"]
          is_daily_checklist?: boolean | null
          name?: string
          poc?: string
          section_id?: string | null
          start_datetime?: string
          status?: Database["public"]["Enums"]["event_status"]
          university_id?: string | null
          user_id?: string | null
          venue?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_poc_fkey"
            columns: ["poc"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "events_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["section_id"]
          },
          {
            foreignKeyName: "events_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["university_id"]
          },
          {
            foreignKeyName: "events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      exam_scores: {
        Row: {
          created_at: string | null
          event_id: string
          pass_status: boolean
          score_id: string
          score_obtained: number
          student_id: string
          total_score: number
        }
        Insert: {
          created_at?: string | null
          event_id: string
          pass_status: boolean
          score_id?: string
          score_obtained: number
          student_id: string
          total_score: number
        }
        Update: {
          created_at?: string | null
          event_id?: string
          pass_status?: boolean
          score_id?: string
          score_obtained?: number
          student_id?: string
          total_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "exam_scores_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "exam_scores_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      feature_permissions: {
        Row: {
          alerts: boolean | null
          announcements: boolean | null
          curriculum: boolean | null
          dashboard: boolean | null
          employees: boolean | null
          events: boolean | null
          feedback: boolean | null
          reports: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          students: boolean | null
          teaching_hours: boolean | null
        }
        Insert: {
          alerts?: boolean | null
          announcements?: boolean | null
          curriculum?: boolean | null
          dashboard?: boolean | null
          employees?: boolean | null
          events?: boolean | null
          feedback?: boolean | null
          reports?: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          students?: boolean | null
          teaching_hours?: boolean | null
        }
        Update: {
          alerts?: boolean | null
          announcements?: boolean | null
          curriculum?: boolean | null
          dashboard?: boolean | null
          employees?: boolean | null
          events?: boolean | null
          feedback?: boolean | null
          reports?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          students?: boolean | null
          teaching_hours?: boolean | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          category: Database["public"]["Enums"]["feedback_category"]
          feedback_text: string
          id: string
          rating: number | null
          status: Database["public"]["Enums"]["feedback_status"]
          submitted_at: string
          submitted_by_student_id: string | null
          submitted_by_user_id: string | null
          target_id: string
          target_type: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["feedback_category"]
          feedback_text: string
          id?: string
          rating?: number | null
          status?: Database["public"]["Enums"]["feedback_status"]
          submitted_at?: string
          submitted_by_student_id?: string | null
          submitted_by_user_id?: string | null
          target_id: string
          target_type: string
        }
        Update: {
          category?: Database["public"]["Enums"]["feedback_category"]
          feedback_text?: string
          id?: string
          rating?: number | null
          status?: Database["public"]["Enums"]["feedback_status"]
          submitted_at?: string
          submitted_by_student_id?: string | null
          submitted_by_user_id?: string | null
          target_id?: string
          target_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_submitted_by_student_id_fkey"
            columns: ["submitted_by_student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "feedback_submitted_by_user_id_fkey"
            columns: ["submitted_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      holidays: {
        Row: {
          created_at: string | null
          date: string
          holiday_id: string
          name: string
          university_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          holiday_id?: string
          name: string
          university_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          holiday_id?: string
          name?: string
          university_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "holidays_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["university_id"]
          },
        ]
      }
      sections: {
        Row: {
          created_at: string | null
          department: string
          name: string
          section_id: string
          university_id: string
          year: number
        }
        Insert: {
          created_at?: string | null
          department: string
          name: string
          section_id?: string
          university_id: string
          year: number
        }
        Update: {
          created_at?: string | null
          department?: string
          name?: string
          section_id?: string
          university_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "sections_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["university_id"]
          },
        ]
      }
      slots: {
        Row: {
          created_at: string | null
          end_datetime: string | null
          linked_event_id: string | null
          linked_topic_id: string | null
          responsible_person: string
          section_id: string
          slot_id: string
          slot_name: string
          slot_type: Database["public"]["Enums"]["slot_type"]
          start_datetime: string | null
          topic: string | null
          university_id: string | null
        }
        Insert: {
          created_at?: string | null
          end_datetime?: string | null
          linked_event_id?: string | null
          linked_topic_id?: string | null
          responsible_person: string
          section_id: string
          slot_id?: string
          slot_name: string
          slot_type: Database["public"]["Enums"]["slot_type"]
          start_datetime?: string | null
          topic?: string | null
          university_id?: string | null
        }
        Update: {
          created_at?: string | null
          end_datetime?: string | null
          linked_event_id?: string | null
          linked_topic_id?: string | null
          responsible_person?: string
          section_id?: string
          slot_id?: string
          slot_name?: string
          slot_type?: Database["public"]["Enums"]["slot_type"]
          start_datetime?: string | null
          topic?: string | null
          university_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "slots_linked_event_id_fkey"
            columns: ["linked_event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "slots_linked_topic_id_fkey"
            columns: ["linked_topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["topic_id"]
          },
          {
            foreignKeyName: "slots_responsible_person_fkey"
            columns: ["responsible_person"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "slots_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["section_id"]
          },
        ]
      }
      student_attendance: {
        Row: {
          attendance_id: string
          created_at: string | null
          date: string
          engagement_rate: number | null
          leave_reason: string | null
          present: boolean
          student_id: string
        }
        Insert: {
          attendance_id?: string
          created_at?: string | null
          date: string
          engagement_rate?: number | null
          leave_reason?: string | null
          present?: boolean
          student_id: string
        }
        Update: {
          attendance_id?: string
          created_at?: string | null
          date?: string
          engagement_rate?: number | null
          leave_reason?: string | null
          present?: boolean
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      student_event_details: {
        Row: {
          created_at: string | null
          event_id: string
          feedback: string | null
          is_present: boolean
          student_event_id: string
          student_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          feedback?: string | null
          is_present?: boolean
          student_event_id?: string
          student_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          feedback?: string | null
          is_present?: boolean
          student_event_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_event_details_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "student_event_details_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      student_payments: {
        Row: {
          amount_paid: number
          created_at: string | null
          payment_id: string
          semester: number
          student_id: string
          total_due: number
          transaction_id: string
        }
        Insert: {
          amount_paid: number
          created_at?: string | null
          payment_id?: string
          semester: number
          student_id: string
          total_due: number
          transaction_id: string
        }
        Update: {
          amount_paid?: number
          created_at?: string | null
          payment_id?: string
          semester?: number
          student_id?: string
          total_due?: number
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      students: {
        Row: {
          cgpa: number | null
          created_at: string | null
          current_semester: number
          email: string
          enrollment_year: number
          joining_year: number
          name: string
          roll_number: string
          section_id: string
          student_id: string
        }
        Insert: {
          cgpa?: number | null
          created_at?: string | null
          current_semester: number
          email: string
          enrollment_year: number
          joining_year: number
          name: string
          roll_number: string
          section_id: string
          student_id?: string
        }
        Update: {
          cgpa?: number | null
          created_at?: string | null
          current_semester?: number
          email?: string
          enrollment_year?: number
          joining_year?: number
          name?: string
          roll_number?: string
          section_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["section_id"]
          },
        ]
      }
      subjects: {
        Row: {
          created_at: string | null
          credits: number
          name: string
          section_id: string
          semester: number
          subject_id: string
        }
        Insert: {
          created_at?: string | null
          credits: number
          name: string
          section_id: string
          semester: number
          subject_id?: string
        }
        Update: {
          created_at?: string | null
          credits?: number
          name?: string
          section_id?: string
          semester?: number
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subjects_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["section_id"]
          },
        ]
      }
      topics: {
        Row: {
          completed: boolean
          created_at: string | null
          duration: number
          name: string
          subject_id: string
          topic_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string | null
          duration: number
          name: string
          subject_id: string
          topic_id?: string
        }
        Update: {
          completed?: boolean
          created_at?: string | null
          duration?: number
          name?: string
          subject_id?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topics_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["subject_id"]
          },
        ]
      }
      universities: {
        Row: {
          created_at: string | null
          established_year: number
          location: string
          name: string
          university_id: string
        }
        Insert: {
          created_at?: string | null
          established_year: number
          location: string
          name: string
          university_id?: string
        }
        Update: {
          created_at?: string | null
          established_year?: number
          location?: string
          name?: string
          university_id?: string
        }
        Relationships: []
      }
      user_attendance: {
        Row: {
          attendance_id: string
          created_at: string | null
          date: string
          leave_reason: string | null
          present: boolean
          user_id: string
        }
        Insert: {
          attendance_id?: string
          created_at?: string | null
          date: string
          leave_reason?: string | null
          present?: boolean
          user_id: string
        }
        Update: {
          attendance_id?: string
          created_at?: string | null
          date?: string
          leave_reason?: string | null
          present?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_attendance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          auth_user_id: string | null
          created_at: string | null
          email: string
          full_name: string | null
          is_active: boolean | null
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          is_active?: boolean | null
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          is_active?: boolean | null
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      active_announcements: {
        Row: {
          announcement_id: string | null
          content: string | null
          created_at: string | null
          created_by: string | null
          is_active: boolean | null
          publish_from: string | null
          publish_until: string | null
          title: string | null
        }
        Insert: {
          announcement_id?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          is_active?: boolean | null
          publish_from?: string | null
          publish_until?: string | null
          title?: string | null
        }
        Update: {
          announcement_id?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          is_active?: boolean | null
          publish_from?: string | null
          publish_until?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      curriculum_progress_stats: {
        Row: {
          ahead_topics: number | null
          avg_days_variance: number | null
          behind_topics: number | null
          completed_topics: number | null
          section_id: string | null
          section_name: string | null
          subject_id: string | null
          subject_name: string | null
          total_scheduled_topics: number | null
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_scheduled_topics_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["section_id"]
          },
          {
            foreignKeyName: "curriculum_scheduled_topics_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["subject_id"]
          },
        ]
      }
    }
    Functions: {
      get_students_with_attendance: {
        Args: { univ_id: string; sec_id?: string }
        Returns: {
          student_id: string
          name: string
          email: string
          roll_number: string
          joining_year: number
          cgpa: number
          section_name: string
          university_name: string
          attendance_percentage: number
        }[]
      }
      get_students_with_attendance_by_university: {
        Args: { univ_id: string }
        Returns: {
          student_id: string
          name: string
          email: string
          roll_number: string
          joining_year: number
          section_name: string
          university_name: string
          attendance_percentage: number
        }[]
      }
      get_university_details: {
        Args: Record<PropertyKey, never>
        Returns: {
          university_id: string
          university_name: string
          number_of_sections: number
          number_of_students: number
        }[]
      }
      get_user_permissions: {
        Args: { user_id: string }
        Returns: {
          role: Database["public"]["Enums"]["user_role"]
          dashboard: boolean
          curriculum: boolean
          students: boolean
          employees: boolean
          teaching_hours: boolean
          events: boolean
          announcements: boolean
          feedback: boolean
          alerts: boolean
          reports: boolean
        }[]
      }
      is_announcement_visible_to_user: {
        Args: { _announcement_id: string; _user_id: string }
        Returns: boolean
      }
      run_safe_query: {
        Args: { query: string }
        Returns: Json
      }
    }
    Enums: {
      checklist_status: "completed" | "pending" | "in_progress"
      checklist_type: "exam" | "class" | "guest_lecture" | "daily_test"
      event_status: "planned" | "ongoing" | "completed"
      event_type: "section_specific" | "university_specific" | "user_specific"
      feedback_category:
        | "query"
        | "complaint"
        | "suggestion"
        | "appreciation"
        | "general"
      feedback_status: "resolved" | "unresolved"
      slot_type:
        | "exam"
        | "learning_session"
        | "guest_lecture"
        | "topic_discussion"
      user_role:
        | "instructor"
        | "mentor"
        | "event_manager"
        | "college_admin"
        | "central_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      checklist_status: ["completed", "pending", "in_progress"],
      checklist_type: ["exam", "class", "guest_lecture", "daily_test"],
      event_status: ["planned", "ongoing", "completed"],
      event_type: ["section_specific", "university_specific", "user_specific"],
      feedback_category: [
        "query",
        "complaint",
        "suggestion",
        "appreciation",
        "general",
      ],
      feedback_status: ["resolved", "unresolved"],
      slot_type: [
        "exam",
        "learning_session",
        "guest_lecture",
        "topic_discussion",
      ],
      user_role: [
        "instructor",
        "mentor",
        "event_manager",
        "college_admin",
        "central_admin",
      ],
    },
  },
} as const

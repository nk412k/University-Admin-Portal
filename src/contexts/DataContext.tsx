import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Student,
  University,
  Section,
  Employee,
  Subject,
  PlannedSession,
  ActualSession,
  Alert,
  Event,
} from "@/types";

interface DataContextProps {
  universities: University[];
  sections: Section[];
  students: Student[];
  employees: Employee[];
  subjects: Subject[];
  plannedSessions: PlannedSession[];
  actualSessions: ActualSession[];
  alerts: Alert[];
  events: Event[];
  isLoading: boolean;
}

interface DataProviderProps {
  children: React.ReactNode;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [plannedSessions, setPlannedSessions] = useState<PlannedSession[]>([]);
  const [actualSessions, setActualSessions] = useState<ActualSession[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const { data: universitiesData, error: universitiesError } =
          await supabase.from("universities").select("*");

        if (universitiesError) throw universitiesError;

        const { data: sectionsData, error: sectionsError } = await supabase
          .from("sections")
          .select("*");

        if (sectionsError) throw sectionsError;

        const { data: studentsData, error: studentsError } = await supabase
          .from("students")
          .select("*");

        if (studentsError) throw studentsError;

        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("*");

        if (usersError) throw usersError;

        const { data: subjectsData, error: subjectsError } = await supabase
          .from("subjects")
          .select("*");

        if (subjectsError) throw subjectsError;

        const { data: plannedSessionsData, error: plannedSessionsError } =
          await supabase
            .from("slots")
            .select("*")
            .eq("slot_type", "learning_session");

        if (plannedSessionsError) throw plannedSessionsError;

        const { data: actualSessionsData, error: actualSessionsError } =
          await supabase.from("topics").select("*").eq("completed", true);

        if (actualSessionsError) throw actualSessionsError;

        const { data: alertsData, error: alertsError } = await supabase
          .from("student_attendance")
          .select("*")
          .eq("present", false)
          .limit(20); // Limit for demo purposes

        if (alertsError) throw alertsError;

        const { data: eventsData, error: eventsError } = await supabase
          .from("events")
          .select("*");

        if (eventsError) throw eventsError;

        const mappedEmployees: Employee[] = usersData.map((user) => {
          return {
            id: user.user_id,
            employee_id: user.user_id.slice(0, 8),
            full_name: user.name,
            role: user.role,
            university_id: "",
            email: user.email,
            is_instructor: user.role === "instructor",
            is_mentor: user.role === "mentor",
            created_at: user.created_at,
            updated_at: user.created_at,
            position: user.role.replace("_", " "),
            department: "",
          };
        });

        const mappedPlannedSessions: PlannedSession[] = plannedSessionsData.map(
          (slot) => ({
            id: slot.slot_id,
            subject_id: slot.linked_topic_id || "",
            section_id: slot.section_id,
            university_id:
              sectionsData.find((s) => s.section_id === slot.section_id)
                ?.university_id || "",
            date: slot.start_datetime || new Date().toISOString(),
            topic: slot.slot_name,
            created_at: slot.created_at,
            updated_at: slot.created_at,
          })
        );

        const mappedActualSessions: ActualSession[] = actualSessionsData.map(
          (topic) => ({
            id: topic.topic_id,
            subject_id: topic.subject_id,
            section_id:
              subjectsData.find((s) => s.subject_id === topic.subject_id)
                ?.section_id || "",
            university_id: "",
            date: topic.created_at,
            topic: topic.name,
            duration_minutes: Math.floor(Number(topic.duration) * 60) || 45,
            attendance_percentage: Math.floor(Math.random() * 30) + 70,
            created_at: topic.created_at,
            updated_at: topic.created_at,
          })
        );

        const mappedAlerts: Alert[] = alertsData.map((attendance, index) => ({
          id: attendance.attendance_id,
          title: `Attendance Alert`,
          message: `Student missed class on ${new Date(
            attendance.date
          ).toLocaleDateString()}`,
          severity:
            index % 3 === 0 ? "high" : index % 2 === 0 ? "medium" : "low",
          category: "student",
          is_read: false,
          university_id: "",
          created_at: attendance.created_at,
          updated_at: attendance.created_at,
          alert_type: "attendance",
        }));

        setUniversities(universitiesData || []);
        setSections(sectionsData || []);
        setStudents(studentsData || []);
        setEmployees(mappedEmployees || []);
        setSubjects(subjectsData || []);
        setPlannedSessions(mappedPlannedSessions || []);
        setActualSessions(mappedActualSessions || []);
        setAlerts(mappedAlerts || []);
        setEvents(eventsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const value: DataContextProps = {
    universities,
    sections,
    students,
    employees,
    subjects,
    plannedSessions,
    actualSessions,
    alerts,
    events,
    isLoading,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

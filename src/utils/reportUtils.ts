import { supabase } from "@/integrations/supabase/client";
import { Section, University } from "@/types";

export interface SectionReport {
  id: string;
  section_id: string;
  section_name: string;
  university_id: string;
  university_name: string;
  report_date: string;
  curriculum_completion_percentage: number;
  attendance_average: number;
  flagged_deviations: number;
  escalations_raised: number;
  escalations_resolved: number;
  upcoming_events_count: number;
  feedback_satisfaction_score: number | null;
  report_type: string;
  report_period: string;
}

export const fetchSectionReports = async (): Promise<SectionReport[]> => {
  try {
    const { data: sections, error: sectionsError } = await supabase.from(
      "sections"
    ).select(`
        section_id,
        name,
        university_id,
        universities (
          name
        )
      `);

    if (sectionsError) throw sectionsError;
    if (!sections) return [];

    const reports: SectionReport[] = [];

    for (const section of sections) {
      const { data: subjects } = await supabase
        .from("subjects")
        .select("subject_id")
        .eq("section_id", section.section_id);

      let totalTopics = 0;
      let completedTopics = 0;

      if (subjects && subjects.length > 0) {
        const subjectIds = subjects.map((s) => s.subject_id);

        const { data: topics } = await supabase
          .from("topics")
          .select("*")
          .in("subject_id", subjectIds);

        if (topics) {
          totalTopics = topics.length;
          completedTopics = topics.filter((topic) => topic.completed).length;
        }
      }

      const curriculumCompletionPercentage =
        totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

      const { data: students } = await supabase
        .from("students")
        .select("student_id")
        .eq("section_id", section.section_id);

      let attendanceAverage = 0;
      if (students && students.length > 0) {
        const studentIds = students.map((s) => s.student_id);
        const { data: attendance } = await supabase
          .from("student_attendance")
          .select("present")
          .in("student_id", studentIds);

        if (attendance && attendance.length > 0) {
          const presentCount = attendance.filter((a) => a.present).length;
          attendanceAverage = Math.round(
            (presentCount / attendance.length) * 100
          );
        }
      }

      const now = new Date();
      const { data: events, error: eventsError } = await supabase
        .from("events")
        .select("event_id")
        .eq("section_id", section.section_id)
        .gt("start_datetime", now.toISOString())
        .limit(10);

      if (eventsError) console.error("Error fetching events:", eventsError);
      const upcomingEventsCount = events?.length || 0;

      const flaggedDeviations = Math.floor(Math.random() * 5);
      const escalationsRaised = Math.floor(Math.random() * 10);
      const escalationsResolved = Math.floor(escalationsRaised * Math.random());

      const feedbackSatisfactionScore = 3.5 + Math.random() * 1.5;

      reports.push({
        id: `report-${section.section_id}`,
        section_id: section.section_id,
        section_name: section.name,
        university_id: section.university_id,
        university_name: section.universities?.name || "Unknown University",
        report_date: new Date().toISOString().split("T")[0],
        curriculum_completion_percentage: curriculumCompletionPercentage,
        attendance_average: attendanceAverage,
        flagged_deviations: flaggedDeviations,
        escalations_raised: escalationsRaised,
        escalations_resolved: escalationsResolved,
        upcoming_events_count: upcomingEventsCount,
        feedback_satisfaction_score: parseFloat(
          feedbackSatisfactionScore.toFixed(1)
        ),
        report_type: "section_academic_report",
        report_period: "monthly",
      });
    }

    return reports;
  } catch (error) {
    console.error("Error fetching section reports:", error);
    return [];
  }
};

export const generateDemoSectionReports = (
  sections: Section[],
  universities: University[]
): SectionReport[] => {
  return sections.map((section) => {
    const university = universities.find(
      (u) => u.id === section.university_id
    ) || { id: section.university_id, name: "Unknown University" };

    return {
      id: `report-${section.id}`,
      section_id: section.id,
      section_name: section.name,
      university_id: section.university_id,
      university_name: university.name,
      report_date: new Date().toISOString().split("T")[0],
      curriculum_completion_percentage: Math.floor(40 + Math.random() * 60),
      attendance_average: Math.floor(60 + Math.random() * 40),
      flagged_deviations: Math.floor(Math.random() * 5),
      escalations_raised: Math.floor(Math.random() * 10),
      escalations_resolved: Math.floor(Math.random() * 8),
      upcoming_events_count: Math.floor(Math.random() * 6),
      feedback_satisfaction_score: parseFloat(
        (3 + Math.random() * 2).toFixed(1)
      ),
      report_type: "section_academic_report",
      report_period: "monthly",
    };
  });
};

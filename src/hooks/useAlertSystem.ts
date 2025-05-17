import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { differenceInHours, parseISO } from "date-fns";
import { toast } from "@/components/ui/use-toast";

export type AlertCategory =
  | "all"
  | "attendance"
  | "curriculum"
  | "performance"
  | "issues"
  | "payment"
  | "feedback";

export interface SystemAlert {
  id: string;
  title: string;
  message: string;
  severity: "critical" | "warning" | "info";
  category: AlertCategory;
  timestamp: Date;
  dismissed?: boolean;
}

export function useAlertSystem() {
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredAlerts, setFilteredAlerts] = useState<SystemAlert[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<AlertCategory>("all");

  const getDismissedAlerts = (): string[] => {
    const dismissed = sessionStorage.getItem("dismissedAlerts");
    return dismissed ? JSON.parse(dismissed) : [];
  };

  const saveDismissedAlert = (alertId: string) => {
    const dismissed = getDismissedAlerts();
    if (!dismissed.includes(alertId)) {
      dismissed.push(alertId);
      sessionStorage.setItem("dismissedAlerts", JSON.stringify(dismissed));
    }
  };

  const dismissAlert = (alertId: string) => {
    saveDismissedAlert(alertId);
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === alertId ? { ...alert, dismissed: true } : alert
      )
    );
  };

  const filterAlertsByCategory = (category: AlertCategory) => {
    setSelectedCategory(category);
    if (category === "all") {
      setFilteredAlerts(alerts.filter((alert) => !alert.dismissed));
    } else {
      setFilteredAlerts(
        alerts.filter(
          (alert) => alert.category === category && !alert.dismissed
        )
      );
    }
  };

  const getTopCriticalAlerts = (count: number = 5): SystemAlert[] => {
    return alerts
      .filter((alert) => !alert.dismissed && alert.severity === "critical")
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, count);
  };

  const getTodayMetrics = async () => {
    try {
      const today = new Date();
      const dateStr = today.toISOString().split("T")[0];

      const { data: lowCgpaStudents, error: cgpaError } = await supabase
        .from("students")
        .select("student_id")
        .lt("cgpa", 2.5);

      if (cgpaError) throw cgpaError;

      const { data: delayedSections, error: sectionsError } = await supabase
        .from("curriculum_progress_stats")
        .select("section_id")
        .gte("behind_topics", 3);

      if (sectionsError) throw sectionsError;

      const { data: presentInstructors, error: instructorsError } =
        await supabase
          .from("user_attendance")
          .select("user_id")
          .eq("date", dateStr)
          .eq("present", true);

      if (instructorsError) throw instructorsError;

      const { data: todayAttendance, error: attendanceError } = await supabase
        .from("student_attendance")
        .select("attendance_id, present")
        .eq("date", dateStr);

      if (attendanceError) throw attendanceError;

      const totalStudents = todayAttendance?.length || 0;
      const presentStudents =
        todayAttendance?.filter((a) => a.present)?.length || 0;

      return {
        lowCgpaCount: lowCgpaStudents?.length || 0,
        delayedSectionsCount: delayedSections?.length || 0,
        presentInstructorsCount: presentInstructors?.length || 0,
        attendanceToday: {
          present: presentStudents,
          total: totalStudents,
          percentage:
            totalStudents > 0
              ? Math.round((presentStudents / totalStudents) * 100)
              : 0,
        },
      };
    } catch (error) {
      console.error("Error fetching today's metrics:", error);
      return {
        lowCgpaCount: 0,
        delayedSectionsCount: 0,
        presentInstructorsCount: 0,
        attendanceToday: {
          present: 0,
          total: 0,
          percentage: 0,
        },
      };
    }
  };

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const dismissedAlertIds = getDismissedAlerts();

        const systemAlerts: SystemAlert[] = [];

        try {
          const { data: curriculumData, error: curriculumError } =
            await supabase
              .from("curriculum_progress_stats")
              .select("*")
              .gte("behind_topics", 5);

          if (curriculumError) throw curriculumError;

          if (curriculumData && curriculumData.length > 0) {
            curriculumData.forEach((item) => {
              systemAlerts.push({
                id: `curriculum-${item.section_id}-${item.subject_id}`,
                title: "Curriculum Lag Detected",
                message: `${item.subject_name} in ${item.section_name} has ${item.behind_topics} overdue topics.`,
                severity: item.behind_topics >= 10 ? "critical" : "warning",
                category: "curriculum",
                timestamp: new Date(),
                dismissed: dismissedAlertIds.includes(
                  `curriculum-${item.section_id}-${item.subject_id}`
                ),
              });
            });
          }
        } catch (error) {
          console.error("Error fetching curriculum alerts:", error);
        }

        try {
          const { data: attendanceData, error: attendanceError } =
            await supabase.rpc("get_students_with_attendance");

          if (attendanceError) throw attendanceError;

          if (attendanceData && attendanceData.length > 0) {
            attendanceData.forEach((student) => {
              if (student.attendance_percentage < 70) {
                systemAlerts.push({
                  id: `attendance-${student.student_id}`,
                  title: "Critical Low Attendance",
                  message: `${
                    student.name
                  } has critically low attendance at ${student.attendance_percentage.toFixed(
                    1
                  )}%.`,
                  severity: "critical",
                  category: "attendance",
                  timestamp: new Date(),
                  dismissed: dismissedAlertIds.includes(
                    `attendance-${student.student_id}`
                  ),
                });
              } else if (student.attendance_percentage < 90) {
                systemAlerts.push({
                  id: `attendance-${student.student_id}`,
                  title: "Low Attendance",
                  message: `${
                    student.name
                  } has attendance below 90% at ${student.attendance_percentage.toFixed(
                    1
                  )}%.`,
                  severity: "warning",
                  category: "attendance",
                  timestamp: new Date(),
                  dismissed: dismissedAlertIds.includes(
                    `attendance-${student.student_id}`
                  ),
                });
              }
            });
          }
        } catch (error) {
          console.error("Error fetching attendance alerts:", error);
        }

        try {
          const { data: studentsData, error: studentsError } = await supabase
            .from("students")
            .select("*, sections(name)")
            .lt("cgpa", 6);

          if (studentsError) throw studentsError;

          if (studentsData && studentsData.length > 0) {
            studentsData.forEach((student) => {
              const sectionName = student.sections
                ? student.sections.name
                : "Unknown section";

              systemAlerts.push({
                id: `cgpa-${student.student_id}`,
                title: student.cgpa < 4 ? "Critical Low CGPA" : "Low CGPA",
                message: `${student.name} has ${
                  student.cgpa < 4 ? "critically " : ""
                }low CGPA of ${student.cgpa}.`,
                severity: student.cgpa < 4 ? "critical" : "warning",
                category: "performance",
                timestamp: new Date(),
                dismissed: dismissedAlertIds.includes(
                  `cgpa-${student.student_id}`
                ),
              });
            });
          }
        } catch (error) {
          console.error("Error fetching CGPA alerts:", error);
        }

        try {
          const { data: feedbackData, error: feedbackError } = await supabase
            .from("feedback")
            .select("*, users!feedback_submitted_by_user_id_fkey(*)")
            .eq("category", "complaint")
            .order("submitted_at", { ascending: false });

          if (feedbackError) throw feedbackError;

          if (feedbackData && feedbackData.length > 0) {
            feedbackData.forEach((item) => {
              const submissionTime = parseISO(item.submitted_at);
              const hoursDifference = differenceInHours(
                new Date(),
                submissionTime
              );

              if (hoursDifference > 4) {
                const userName =
                  item.users && "name" in item.users
                    ? item.users.name
                    : "Unknown user";

                systemAlerts.push({
                  id: `issue-${item.id}`,
                  title: "SLA Breach - Unresolved Issue",
                  message: `Support issue from ${userName} unresolved for ${hoursDifference} hours.`,
                  severity: hoursDifference > 8 ? "critical" : "warning",
                  category: "issues",
                  timestamp: new Date(),
                  dismissed: dismissedAlertIds.includes(`issue-${item.id}`),
                });
              }
            });
          }
        } catch (error) {
          console.error("Error fetching unresolved issue alerts:", error);
        }

        try {
          const currentYear = new Date().getFullYear();
          const { data: paymentData, error: paymentError } = await supabase
            .from("student_payments")
            .select("*, students(*)")
            .lt("amount_paid", "total_due");

          if (paymentError) throw paymentError;

          if (paymentData && paymentData.length > 0) {
            paymentData.forEach((payment) => {
              const studentName =
                payment.students && payment.students.name
                  ? payment.students.name
                  : "Unknown student";
              const pendingAmount = payment.total_due - payment.amount_paid;

              systemAlerts.push({
                id: `payment-${payment.payment_id}`,
                title: "Payment Pending",
                message: `${studentName} has pending payment of ${pendingAmount} for semester ${payment.semester}.`,
                severity:
                  pendingAmount > payment.total_due * 0.5
                    ? "critical"
                    : "warning",
                category: "payment",
                timestamp: new Date(),
                dismissed: dismissedAlertIds.includes(
                  `payment-${payment.payment_id}`
                ),
              });
            });
          }
        } catch (error) {
          console.error("Error fetching payment alerts:", error);
        }

        try {
          const { data: feedbackData, error: feedbackError } = await supabase
            .from("feedback")
            .select("*, users!feedback_target_id_fkey(*)")
            .eq("target_type", "instructor")
            .lt("rating", 3);

          if (feedbackError) throw feedbackError;

          if (feedbackData && feedbackData.length > 0) {
            feedbackData.forEach((feedback) => {
              const instructorName =
                feedback.users && "name" in feedback.users
                  ? feedback.users.name
                  : "Unknown instructor";

              systemAlerts.push({
                id: `feedback-${feedback.id}`,
                title: "Low Instructor Rating",
                message: `${instructorName} received a low rating of ${feedback.rating}/5.`,
                severity: feedback.rating < 2 ? "critical" : "warning",
                category: "feedback",
                timestamp: new Date(),
                dismissed: dismissedAlertIds.includes(
                  `feedback-${feedback.id}`
                ),
              });
            });
          }
        } catch (error) {
          console.error("Error fetching instructor feedback alerts:", error);
        }

        setAlerts(systemAlerts);
        setFilteredAlerts(systemAlerts.filter((alert) => !alert.dismissed));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching alerts:", error);
        toast({
          title: "Error loading alerts",
          description: "Failed to load system alerts. Please try again later.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchAlerts();
    const intervalId = setInterval(fetchAlerts, 5 * 60 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return {
    alerts: filteredAlerts,
    loading,
    dismissAlert,
    filterAlertsByCategory,
    selectedCategory,
    getTopCriticalAlerts,
    getTodayMetrics,
  };
}

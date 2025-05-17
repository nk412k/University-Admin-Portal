import { useState, useEffect } from "react";
import { Student, Section } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useStudents = (
  universityId?: string,
  sectionId?: Section | null
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    if (!universityId) {
      setIsLoading(false);
      return;
    }

    const fetchStudents = async () => {
      try {
        setIsLoading(true);

        const { data: studentsData, error: studentsError } = await supabase.rpc(
          "get_students_with_attendance",
          {
            univ_id: universityId,
            sec_id: sectionId?.section_id || null,
          }
        );

        if (studentsError) throw studentsError;

        const mappedStudents = studentsData.map((student: any) => {
          const attendanceRate = student.attendance_percentage || 0;
          let risk_score = 0;

          if (attendanceRate) {
            risk_score =
              100 - Math.round(attendanceRate * 0.4 + student.cgpa * 0.6);
          }

          let risk_level: "low" | "medium" | "high" = "low";
          if (risk_score > 70) {
            risk_level = "high";
          } else if (risk_score > 40) {
            risk_level = "medium";
          }

          const studentObj: Student = {
            student_id: student.student_id,
            name: student.name,
            email: student.email || "",
            section_id: student.section_id || "",
            roll_number: student.roll_number,
            joining_year: student.joining_year,
            current_semester: 1,
            enrollment_year: new Date().getFullYear(),
            cgpa: student.cgpa,
            id: student.student_id,
            full_name: student.name,
            risk_level,
            risk_score,
            enrollment_date: new Date().toISOString(),
            contact_number: "",
            updated_at: new Date().toISOString(),
            attendance_percentage: student.attendance_percentage,
            section_name: student.section_name,
            university_id: universityId,
          };

          return studentObj;
        });

        setStudents(mappedStudents);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load students:", error);
        toast({
          title: "Failed to load students",
          description: "An error occurred while loading the students data",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [universityId, sectionId]);

  const getStudentsAttendanceForDate = async (
    studentIds: string[],
    date: string
  ) => {
    if (!studentIds.length) return [];

    try {
      const { data: existingRecords, error } = await supabase
        .from("student_attendance")
        .select("*")
        .in("student_id", studentIds)
        .eq("date", date);

      if (error) throw error;

      const recordsByStudentId = (existingRecords || []).reduce(
        (acc, record) => {
          acc[record.student_id] = record;
          return acc;
        },
        {} as Record<string, any>
      );

      const missingStudentIds = studentIds.filter(
        (id) => !recordsByStudentId[id]
      );

      if (missingStudentIds.length > 0) {
        const recordsToInsert = missingStudentIds.map((studentId) => ({
          student_id: studentId,
          date,
          present: false,
        }));

        const { data: insertedRecords, error: insertError } = await supabase
          .from("student_attendance")
          .insert(recordsToInsert)
          .select();

        if (insertError) throw insertError;

        (insertedRecords || []).forEach((record) => {
          recordsByStudentId[record.student_id] = record;
        });
      }

      return Object.values(recordsByStudentId);
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      toast({
        title: "Attendance Error",
        description: "Failed to fetch attendance records",
        variant: "destructive",
      });
      return [];
    }
  };

  const getOrCreateAttendance = async (studentId: string, date: string) => {
    try {
      const { data: existingAttendance, error: checkError } = await supabase
        .from("student_attendance")
        .select("*")
        .eq("student_id", studentId)
        .eq("date", date)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError;
      }

      if (existingAttendance) {
        return existingAttendance;
      }

      const { data: newAttendance, error: insertError } = await supabase
        .from("student_attendance")
        .insert([
          {
            student_id: studentId,
            date: date,
            present: false,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      return newAttendance;
    } catch (error) {
      console.error("Error managing attendance:", error);
      toast({
        title: "Attendance Error",
        description: "Failed to manage attendance record",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateAttendance = async (
    attendanceId: string,
    present: boolean,
    leaveReason?: string
  ) => {
    try {
      const { data, error } = await supabase
        .from("student_attendance")
        .update({
          present: present,
          leave_reason: leaveReason || null,
        })
        .eq("attendance_id", attendanceId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Attendance Updated",
        description: "Attendance record has been updated successfully",
        variant: "default",
      });

      return data;
    } catch (error) {
      console.error("Error updating attendance:", error);
      toast({
        title: "Update Error",
        description: "Failed to update attendance record",
        variant: "destructive",
      });
      return null;
    }
  };

  const getStudentAttendanceHistory = async (
    studentId: string,
    startDate?: string,
    endDate?: string
  ) => {
    try {
      let query = supabase
        .from("student_attendance")
        .select("*")
        .eq("student_id", studentId)
        .order("date", { ascending: false });

      if (startDate) {
        query = query.gte("date", startDate);
      }

      if (endDate) {
        query = query.lte("date", endDate);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error("Error fetching attendance history:", error);
      toast({
        title: "Fetch Error",
        description: "Failed to retrieve attendance records",
        variant: "destructive",
      });
      return [];
    }
  };

  return {
    students,
    isLoading,
    getOrCreateAttendance,
    updateAttendance,
    getStudentAttendanceHistory,
    getStudentsAttendanceForDate,
  };
};

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { addDays } from "date-fns";

export interface StudentFeeData {
  id: string;
  student_id: string;
  full_name: string;
  roll_number: string;
  section_id: string;
  university_id: string;
  semester: number;
  totalFees: number;
  paidFees: number;
  pendingFees: number;
  dueDate: Date;
  status: "paid" | "pending" | "overdue";
}

export const useStudentFees = (universityId?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [feeData, setFeeData] = useState<StudentFeeData[]>([]);

  useEffect(() => {
    if (!universityId) {
      setIsLoading(false);
      return;
    }

    const fetchStudentFees = async () => {
      try {
        setIsLoading(true);

        const { data: studentsData, error: studentsError } = await supabase
          .from("students")
          .select(
            `
            student_id,
            name,
            roll_number,
            section_id,
            joining_year,
            current_semester,
            sections!inner(university_id)
          `
          )
          .eq("sections.university_id", universityId);

        if (studentsError) throw studentsError;

        if (!studentsData || studentsData.length === 0) {
          setFeeData([]);
          setIsLoading(false);
          return;
        }

        const studentIds = studentsData.map((student) => student.student_id);

        const { data: paymentsData, error: paymentsError } = await supabase
          .from("student_payments")
          .select("*")
          .in("student_id", studentIds);

        if (paymentsError) throw paymentsError;

        const mappedFeeData: StudentFeeData[] = studentsData.map((student) => {
          const studentPayments =
            paymentsData?.filter(
              (payment) => payment.student_id === student.student_id
            ) || [];

          const semester =
            studentPayments.length > 0
              ? studentPayments[0].semester
              : student.current_semester || 1;

          const totalFees = studentPayments.reduce(
            (sum, payment) => sum + Number(payment.total_due),
            0
          );
          const paidFees = studentPayments.reduce(
            (sum, payment) => sum + Number(payment.amount_paid),
            0
          );
          const pendingFees = Math.max(0, totalFees - paidFees);

          const dueDate = addDays(new Date(), 15);

          if (studentPayments.length > 0 && Math.random() > 0.7) {
            dueDate.setDate(dueDate.getDate() - 30);
          }

          let status: "paid" | "pending" | "overdue" = "pending";
          if (pendingFees <= 0) {
            status = "paid";
          } else if (dueDate < new Date()) {
            status = "overdue";
          }

          return {
            id: student.student_id,
            student_id: student.student_id,
            full_name: student.name,
            roll_number: student.roll_number,
            section_id: student.section_id,
            university_id: student.sections.university_id,
            semester,
            totalFees,
            paidFees,
            pendingFees,
            dueDate,
            status,
          };
        });

        setFeeData(mappedFeeData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching student fee data:", error);
        toast({
          title: "Error fetching fee data",
          description:
            "There was a problem loading student payment information.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchStudentFees();
  }, [universityId]);

  return { feeData, isLoading };
};

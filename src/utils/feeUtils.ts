import { StudentFeeData } from "@/hooks/useStudentFees";
import { Student } from "@/types";
import { addDays } from "date-fns";

export const calculateFeeStats = (students: StudentFeeData[]) => {
  const totalStudents = students.length;
  const totalFeesAmount = students.reduce(
    (sum, student) => sum + student.totalFees,
    0
  );
  const totalPendingAmount = students.reduce(
    (sum, student) => sum + student.pendingFees,
    0
  );

  const overdue = students.filter(
    (student) => student.status === "overdue"
  ).length;
  const overduePercentage = totalStudents
    ? Math.round((overdue / totalStudents) * 100)
    : 0;

  const paid = students.filter((student) => student.status === "paid").length;
  const paidPercentage = totalStudents
    ? Math.round((paid / totalStudents) * 100)
    : 0;

  return {
    totalFeesAmount,
    totalPendingAmount,
    overdue,
    overduePercentage,
    paid,
    paidPercentage,
  };
};

export const generateStudentFeeData = (students: Student[]) => {
  return students.map((student) => {
    const totalFees = Math.round(Math.random() * 100000) + 50000;
    const paidFees = Math.round(Math.random() * totalFees);
    const pendingFees = totalFees - paidFees;

    let dueDate = addDays(new Date(), 15);

    if (pendingFees > 0 && Math.random() > 0.7) {
      dueDate = addDays(new Date(), -15);
    }

    let status = "pending";
    if (pendingFees <= 0) {
      status = "paid";
    } else if (dueDate < new Date()) {
      status = "overdue";
    }

    return {
      ...student,
      totalFees,
      paidFees,
      pendingFees,
      dueDate,
      status,
    };
  });
};

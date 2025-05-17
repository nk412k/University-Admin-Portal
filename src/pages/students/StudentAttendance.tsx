import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { useUniversity } from "@/contexts/UniversityContext";
import { Student } from "@/types";
import StudentAttendanceManager from "@/components/students/StudentAttendanceManager";

const StudentAttendance = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const { students, sections } = useData();
  const { activeUniversity } = useUniversity();
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (studentId && students.length > 0) {
      const foundStudent = students.find(
        (s) => s.student_id === studentId || s.id === studentId
      );
      if (foundStudent) {
        setStudent(foundStudent);
      }
    } else {
      setStudent(null);
    }
  }, [studentId, students]);

  if (!activeUniversity) {
    return (
      <div className="container mx-auto p-4">
        <p>Please select a university first.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Helmet>
        <title>
          {student ? `${student.name}'s Attendance` : "Student Attendance"}
        </title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          {student ? `${student.name}'s Attendance` : "Student Attendance"}
        </h1>
        <p className="text-muted-foreground">
          {student
            ? `Manage attendance records for ${student.name}.`
            : `Manage attendance records for students by section.`}
        </p>
      </div>

      <div className="grid gap-6">
        {student ? (
          <div className="border rounded-lg p-6 bg-card">
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Student Details</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Name:</span> {student.name}
                    </p>
                    <p>
                      <span className="font-medium">Roll Number:</span>{" "}
                      {student.roll_number}
                    </p>
                    <p>
                      <span className="font-medium">Section:</span>{" "}
                      {student.section_name}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Attendance Overview
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Attendance Rate:</span>{" "}
                      {student.attendance_percentage?.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">
                Attendance Management
              </h3>
              <StudentAttendanceManager
                student={student}
                universityId={activeUniversity.university_id}
                sections={sections}
              />
            </div>
          </div>
        ) : (
          <div className="border rounded-lg p-6 bg-card">
            <h3 className="text-lg font-medium mb-4">
              Section Attendance Management
            </h3>
            <StudentAttendanceManager
              universityId={activeUniversity.university_id}
              sections={sections}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAttendance;

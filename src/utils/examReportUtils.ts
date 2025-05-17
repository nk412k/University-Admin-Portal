export interface ExamReport {
  id: string;
  name: string;
  university_name: string;
  section_name: string;
  date: string;
  subject: string;
  status: string;
  total_students: number;
  pass_rate: number;
  average_score: number;
  highest_score: number;
  report_type: "section_specific" | "university_specific" | "user_specific";
  subject_name: string;
  exam_date: string;
}

export interface ExamReportWithDetails {
  id: string;
  university_name: string;
  section_name: string;
  subject_name: string;
  exam_date: string;
  total_marks: number;
  pass_marks: number;
  pass_percentage: number;
  students: {
    id: string;
    student_id: string;
    student_name: string;
    marks_obtained: number;
    grade: string;
    pass_status: boolean;
    remarks?: string;
  }[];
}

export interface ExamScore {
  id: string;
  student_name: string;
  student_id: string;
  university_name: string;
  section_name: string;
  exam_name: string;
  subject: string;
  date: string;
  score: number;
  total: number;
  percentage: number;
  pass_status: boolean;
}

export const generateDemoExamReports = (count = 10): ExamReport[] => {
  const universities = [
    "Metropolis University",
    "Coastal Tech Institute",
    "Mountain View College",
    "Heritage University",
  ];
  const sections = ["CSE-A", "CSE-B", "ECE-A", "ECE-B", "ME-A", "ME-B"];
  const subjects = [
    "Data Structures",
    "Machine Learning",
    "Database Systems",
    "Computer Networks",
    "Operating Systems",
  ];
  const statuses = ["Completed", "Graded", "Pending", "In Review"];

  return Array.from({ length: count }, (_, i) => {
    const passRate = Math.floor(50 + Math.random() * 50);
    const avgScore = Math.floor(60 + Math.random() * 40);
    const highScore = Math.floor(
      Math.max(avgScore, 80) + Math.random() * (100 - Math.max(avgScore, 80))
    );
    const examDate = new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0];
    const subject = subjects[i % subjects.length];

    return {
      id: `exam-${i}`,
      name: `${subject} Mid-Term Exam`,
      university_name:
        universities[Math.floor(Math.random() * universities.length)],
      section_name: sections[Math.floor(Math.random() * sections.length)],
      date: examDate,
      subject: subject,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      total_students: Math.floor(30 + Math.random() * 30),
      pass_rate: passRate,
      average_score: avgScore,
      highest_score: highScore,
      report_type: "section_specific" as
        | "section_specific"
        | "university_specific"
        | "user_specific",
      subject_name: subject,
      exam_date: examDate,
    };
  });
};

export const generateDemoExamScores = (count = 50): ExamScore[] => {
  const studentNames = [
    "John Smith",
    "Emma Johnson",
    "Michael Brown",
    "Sophia Garcia",
    "William Davis",
    "Olivia Miller",
    "James Wilson",
    "Ava Martinez",
    "Alexander Anderson",
    "Mia Thomas",
    "Benjamin Taylor",
    "Charlotte Jackson",
    "Elijah White",
    "Amelia Harris",
    "Lucas Clark",
  ];

  const universities = [
    "Metropolis University",
    "Coastal Tech Institute",
    "Mountain View College",
    "Heritage University",
  ];
  const sections = ["CSE-A", "CSE-B", "ECE-A", "ECE-B", "ME-A", "ME-B"];
  const subjects = [
    "Data Structures",
    "Machine Learning",
    "Database Systems",
    "Computer Networks",
    "Operating Systems",
  ];

  const exams = subjects.map((subject) => `${subject} Mid-Term Exam`);

  return Array.from({ length: count }, (_, i) => {
    const score = Math.floor(40 + Math.random() * 60);
    const total = 100;
    const percentage = score;
    const pass_status = score >= 40;

    return {
      id: `score-${i}`,
      student_name:
        studentNames[Math.floor(Math.random() * studentNames.length)],
      student_id: `STU${10000 + i}`,
      university_name:
        universities[Math.floor(Math.random() * universities.length)],
      section_name: sections[Math.floor(Math.random() * sections.length)],
      exam_name: exams[Math.floor(Math.random() * exams.length)],
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      date: new Date(
        Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0],
      score,
      total,
      percentage,
      pass_status,
    };
  });
};

export const fetchExamReports = async (): Promise<ExamReport[]> => {
  try {
    return generateDemoExamReports();
  } catch (error) {
    console.error("Error fetching exam reports:", error);
    return [];
  }
};

export const fetchExamScores = async (): Promise<ExamScore[]> => {
  try {
    return generateDemoExamScores();
  } catch (error) {
    console.error("Error fetching exam scores:", error);
    return [];
  }
};

export const fetchExamReportDetails = async (
  reportId: string
): Promise<ExamReportWithDetails | null> => {
  try {
    const reports = generateDemoExamReports();
    const report = reports.find((r) => r.id === reportId);

    if (!report) return null;

    const studentCount = Math.floor(20 + Math.random() * 20);
    const totalMarks = 100;
    const passMarks = 40;

    const students = Array.from({ length: studentCount }, (_, i) => {
      const marks = Math.floor(20 + Math.random() * 80);
      const passStatus = marks >= passMarks;
      let grade = "F";

      if (marks >= 90) grade = "A";
      else if (marks >= 80) grade = "B";
      else if (marks >= 70) grade = "C";
      else if (marks >= 60) grade = "D";
      else if (marks >= passMarks) grade = "E";

      return {
        id: `student-${reportId}-${i}`,
        student_id: `S${10000 + i}`,
        student_name: `Student ${i + 1}`,
        marks_obtained: marks,
        grade,
        pass_status: passStatus,
        remarks: passStatus ? undefined : "Needs improvement",
      };
    });

    const passedStudents = students.filter((s) => s.pass_status).length;
    const passPercentage = Math.round((passedStudents / studentCount) * 100);

    return {
      id: report.id,
      university_name: report.university_name,
      section_name: report.section_name,
      subject_name: report.subject_name,
      exam_date: report.exam_date,
      total_marks: totalMarks,
      pass_marks: passMarks,
      pass_percentage: passPercentage,
      students,
    };
  } catch (error) {
    console.error("Error fetching exam report details:", error);
    return null;
  }
};

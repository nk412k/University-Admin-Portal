import { Student } from "@/types";

export const mockRiskData: Student[] = [
  {
    student_id: "mock-1",
    name: "John Smith",
    email: "john.smith@example.edu",
    section_id: "sec-1",
    section_name: "Computer Science A",
    university_id: "univ-1",
    roll_number: "CS2022001",
    joining_year: 2022,
    current_semester: 3,
    enrollment_year: 2022,
    cgpa: 6.2,
    attendance_percentage: 64,
    risk_level: "high" as const,
    risk_score: 78,
  },
  {
    student_id: "mock-2",
    name: "Jane Doe",
    email: "jane.doe@example.edu",
    section_id: "sec-1",
    section_name: "Computer Science A",
    university_id: "univ-1",
    roll_number: "CS2022002",
    joining_year: 2022,
    current_semester: 3,
    enrollment_year: 2022,
    cgpa: 8.7,
    attendance_percentage: 91,
    risk_level: "low" as const,
    risk_score: 26,
  },
  {
    student_id: "mock-3",
    name: "David Williams",
    email: "david.w@example.edu",
    section_id: "sec-2",
    section_name: "Electronics B",
    university_id: "univ-1",
    roll_number: "EC2022045",
    joining_year: 2022,
    current_semester: 3,
    enrollment_year: 2022,
    cgpa: 7.3,
    attendance_percentage: 76,
    risk_level: "medium" as const,
    risk_score: 53,
  },
  {
    student_id: "mock-4",
    name: "Sarah Johnson",
    email: "sarah.j@example.edu",
    section_id: "sec-2",
    section_name: "Electronics B",
    university_id: "univ-1",
    roll_number: "EC2022032",
    joining_year: 2022,
    current_semester: 3,
    enrollment_year: 2022,
    cgpa: 5.8,
    attendance_percentage: 60,
    risk_level: "high" as const,
    risk_score: 82,
  },
  {
    student_id: "mock-5",
    name: "Michael Brown",
    email: "michael.b@example.edu",
    section_id: "sec-3",
    section_name: "Mechanical C",
    university_id: "univ-1",
    roll_number: "ME2022078",
    joining_year: 2022,
    current_semester: 3,
    enrollment_year: 2022,
    cgpa: 9.2,
    attendance_percentage: 95,
    risk_level: "low" as const,
    risk_score: 18,
  },
  {
    student_id: "mock-6",
    name: "Emily Davis",
    email: "emily.d@example.edu",
    section_id: "sec-3",
    section_name: "Mechanical C",
    university_id: "univ-1",
    roll_number: "ME2022056",
    joining_year: 2022,
    current_semester: 3,
    enrollment_year: 2022,
    cgpa: 7.9,
    attendance_percentage: 82,
    risk_level: "medium" as const,
    risk_score: 46,
  },
  {
    student_id: "mock-7",
    name: "Daniel Miller",
    email: "daniel.m@example.edu",
    section_id: "sec-1",
    section_name: "Computer Science A",
    university_id: "univ-1",
    roll_number: "CS2022023",
    joining_year: 2022,
    current_semester: 3,
    enrollment_year: 2022,
    cgpa: 4.9,
    attendance_percentage: 48,
    risk_level: "high" as const,
    risk_score: 92,
  },
  {
    student_id: "mock-8",
    name: "Olivia Wilson",
    email: "olivia.w@example.edu",
    section_id: "sec-4",
    section_name: "Civil D",
    university_id: "univ-1",
    roll_number: "CV2022012",
    joining_year: 2022,
    current_semester: 3,
    enrollment_year: 2022,
    cgpa: 8.4,
    attendance_percentage: 88,
    risk_level: "low" as const,
    risk_score: 31,
  },
];

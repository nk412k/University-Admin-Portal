import {
  format,
  subDays,
  addDays,
  parseISO,
  addHours,
  addMinutes,
  setHours,
  setMinutes,
} from "date-fns";
import {
  University,
  Section,
  Student,
  Subject,
  PlannedSession,
  ActualSession,
  Event,
  Employee,
  Alert,
  EventStatus,
  EventType,
  RiskLevel,
  Slot,
} from "@/types";

export const randomPastDate = (days: number = 30) => {
  const today = new Date();
  const pastDate = subDays(today, Math.floor(Math.random() * days));
  return format(pastDate, "yyyy-MM-dd");
};

export const randomFutureDate = (days: number = 30) => {
  const today = new Date();
  const futureDate = addDays(today, Math.floor(Math.random() * days));
  return format(futureDate, "yyyy-MM-dd");
};

export const randomPhoneNumber = () => {
  return `+92${Math.floor(Math.random() * 9000000000) + 1000000000}`;
};

export const randomRiskLevel = (): RiskLevel => {
  const levels: RiskLevel[] = ["low", "medium", "high"];
  return levels[Math.floor(Math.random() * levels.length)];
};

export const randomRiskScore = () => {
  return Math.floor(Math.random() * 100);
};

const randomTimeInWorkingHours = (baseDate: Date): Date => {
  const hours = 9 + Math.floor(Math.random() * 8); // 9am to 5pm (9+8-1)
  const minutes = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, or 45 minutes
  return setMinutes(setHours(baseDate, hours), minutes);
};

const randomDuration = (): number => {
  const durations = [30, 45, 60, 90, 120];
  return durations[Math.floor(Math.random() * durations.length)];
};

export const generateUniversities = (count: number): University[] => {
  const universities: University[] = [];

  for (let i = 1; i <= count; i++) {
    const universityId = `uni-${i}`;
    universities.push({
      university_id: universityId,
      name: `University ${i}`,
      location: `Address for University ${i}`,
      established_year: 1950 + Math.floor(Math.random() * 70),
      created_at: randomPastDate(365),
      // Backward compatibility fields
      id: universityId,
      code: `UNI${i}`,
      address: `Address for University ${i}`,
      updated_at: randomPastDate(30),
    });
  }

  return universities;
};

export const generateSections = (
  universityId: string,
  count: number
): Section[] => {
  const sections: Section[] = [];
  const departments = [
    "Computer Science",
    "Electrical Engineering",
    "Mathematics",
    "Physics",
    "Business",
  ];

  for (let i = 1; i <= count; i++) {
    const deptIndex = Math.floor(Math.random() * departments.length);
    const sectionId = `sec-${universityId}-${i}`;
    sections.push({
      section_id: sectionId,
      name: `Section ${String.fromCharCode(64 + i)}`,
      university_id: universityId,
      department: departments[deptIndex],
      year: 2020 + Math.floor(Math.random() * 5),
      created_at: randomPastDate(365),
      // Backward compatibility fields
      id: sectionId,
      updated_at: randomPastDate(30),
    });
  }

  return sections;
};

export const generateStudents = (
  count: number,
  universities: University[],
  sections: Section[]
): Student[] => {
  const students: Student[] = [];

  for (let i = 1; i <= count; i++) {
    const uniIndex = Math.floor(Math.random() * universities.length);
    const university = universities[uniIndex];

    const universitySections = sections.filter(
      (s) => s.university_id === university.university_id
    );
    const sectionIndex = Math.floor(Math.random() * universitySections.length);
    const section = universitySections[sectionIndex];

    const riskLevel = randomRiskLevel();
    const studentId = `stu-${i}`;
    const studentName = `Student ${i}`;

    students.push({
      student_id: studentId,
      name: studentName,
      section_id: section.section_id,
      email: `student${i}@example.com`,
      roll_number: `STU${i.toString().padStart(6, "0")}`,
      joining_year: 2020 + Math.floor(Math.random() * 4),
      current_semester: 1 + Math.floor(Math.random() * 8),
      enrollment_year: 2020 + Math.floor(Math.random() * 4),
      cgpa: parseFloat((Math.random() * 10).toFixed(2)),
      created_at: randomPastDate(365),
      id: studentId,
      full_name: studentName,
      university_id: university.university_id,
      enrollment_date: randomPastDate(730),
      contact_number: randomPhoneNumber(),
      risk_level: riskLevel,
      risk_score:
        riskLevel === "low"
          ? Math.floor(Math.random() * 30)
          : riskLevel === "medium"
          ? 30 + Math.floor(Math.random() * 40)
          : 70 + Math.floor(Math.random() * 30),
      updated_at: randomPastDate(30),
    });
  }

  return students;
};

export const generateSubjects = (
  universities: University[],
  sections: Section[]
): Subject[] => {
  const subjects: Subject[] = [];
  const subjectNames = [
    "Introduction to Programming",
    "Data Structures",
    "Algorithms",
    "Database Systems",
    "Operating Systems",
    "Computer Networks",
    "Artificial Intelligence",
    "Machine Learning",
    "Web Development",
    "Mathematics I",
    "Physics I",
    "Differential Equations",
    "Linear Algebra",
    "Probability and Statistics",
    "Digital Logic Design",
  ];

  let id = 1;

  for (const university of universities) {
    const universitySections = sections.filter(
      (s) => s.university_id === university.university_id
    );

    for (const section of universitySections) {
      const subjectCount = 3 + Math.floor(Math.random() * 3);

      for (let i = 0; i < subjectCount; i++) {
        const subjectIndex = Math.floor(Math.random() * subjectNames.length);
        const subjectId = `sub-${id}`;

        subjects.push({
          subject_id: subjectId,
          name: subjectNames[subjectIndex],
          section_id: section.section_id,
          semester: 1 + Math.floor(Math.random() * 8),
          credits: 3 + Math.floor(Math.random() * 3),
          created_at: randomPastDate(365),
          id: subjectId,
          code: `SUB${id.toString().padStart(3, "0")}`,
          university_id: university.university_id,
          updated_at: randomPastDate(30),
        });
        id++;
      }
    }
  }

  return subjects;
};

export const generatePlannedSessions = (
  subjects: Subject[]
): PlannedSession[] => {
  const sessions: PlannedSession[] = [];
  const topics = [
    "Introduction",
    "Basic Concepts",
    "Advanced Topics",
    "Case Studies",
    "Problem Solving",
    "Review Session",
    "Practical Implementation",
    "Group Discussion",
    "Exam Preparation",
  ];

  let id = 1;

  for (const subject of subjects) {
    const sessionCount = 5 + Math.floor(Math.random() * 6);

    for (let i = 0; i < sessionCount; i++) {
      const topicIndex = Math.floor(Math.random() * topics.length);
      const sessionId = `ps-${id}`;
      sessions.push({
        id: sessionId,
        subject_id: subject.subject_id,
        section_id: subject.section_id,
        university_id: subject.university_id || "",
        topic: `${topics[topicIndex]} - ${subject.name}`,
        date: randomFutureDate(60),
        created_at: randomPastDate(30),
        updated_at: randomPastDate(10),
      });
      id++;
    }
  }

  return sessions;
};

export const generateActualSessions = (
  plannedSessions: PlannedSession[]
): ActualSession[] => {
  const sessions: ActualSession[] = [];

  let id = 1;

  for (const plannedSession of plannedSessions) {
    if (Math.random() < 0.7) {
      const sessionId = `as-${id}`;
      sessions.push({
        id: sessionId,
        subject_id: plannedSession.subject_id,
        section_id: plannedSession.section_id,
        university_id: plannedSession.university_id,
        topic: plannedSession.topic,
        date: randomPastDate(60),
        duration_minutes: 45 + Math.floor(Math.random() * 46),
        attendance_percentage: Math.floor(Math.random() * 101),
        created_at: randomPastDate(30),
        updated_at: randomPastDate(10),
        planned_session_id: plannedSession.id,
        instructor_id: null,
        notes:
          Math.random() > 0.5
            ? `Notes for session on ${plannedSession.topic}`
            : null,
      });
      id++;
    }
  }

  return sessions;
};

export const generateEmployees = (universities: University[]): Employee[] => {
  const employees: Employee[] = [];
  const positions = [
    "Professor",
    "Assistant Professor",
    "Lecturer",
    "Lab Assistant",
    "Department Head",
    "Administrator",
  ];
  const departments = [
    "Computer Science",
    "Electrical Engineering",
    "Mathematics",
    "Physics",
    "Business",
  ];
  const roles: ("instructor" | "mentor" | "event_manager" | "college_admin")[] =
    ["instructor", "mentor", "event_manager", "college_admin"];

  let id = 1;

  for (const university of universities) {
    const employeeCount = 10 + Math.floor(Math.random() * 11);

    for (let i = 0; i < employeeCount; i++) {
      const positionIndex = Math.floor(Math.random() * positions.length);
      const deptIndex = Math.floor(Math.random() * departments.length);
      const roleIndex = Math.floor(Math.random() * roles.length);
      const isInstructor =
        positions[positionIndex].includes("Professor") ||
        positions[positionIndex].includes("Lecturer");
      const employeeId = `emp-${id}`;
      const employeeName = `Employee ${id}`;

      employees.push({
        id: employeeId,
        employee_id: `EMP${id.toString().padStart(4, "0")}`,
        full_name: employeeName,
        role: roles[roleIndex],
        university_id: university.university_id,
        email: `employee${id}@example.com`,
        is_instructor: isInstructor,
        is_mentor: Math.random() > 0.8,
        created_at: randomPastDate(365),
        updated_at: randomPastDate(30),
        position: positions[positionIndex],
        department: departments[deptIndex],
        user_id: null,
        joining_date: randomPastDate(1095),
        contact_number: randomPhoneNumber(),
      });
      id++;
    }
  }

  return employees;
};

export const generateEvents = (
  universities: University[],
  sections: Section[],
  employees: Employee[]
): Event[] => {
  const events: Event[] = [];
  const eventTypes: EventType[] = [
    "section_specific",
    "university_specific",
    "user_specific",
  ];
  const statuses: EventStatus[] = ["planned", "ongoing", "completed"];
  const locations = [
    "Main Hall",
    "Auditorium",
    "Classroom A",
    "Laboratory B",
    "Conference Room",
    "Field",
  ];

  let id = 1;

  for (const university of universities) {
    const eventCount = 5 + Math.floor(Math.random() * 6);
    const universitySections = sections.filter(
      (s) => s.university_id === university.university_id
    );
    const universityEmployees = employees.filter(
      (e) => e.university_id === university.university_id
    );

    for (let i = 0; i < eventCount; i++) {
      const locationIndex = Math.floor(Math.random() * locations.length);
      const statusIndex = Math.floor(Math.random() * statuses.length);
      const eventTypeIndex = Math.floor(Math.random() * eventTypes.length);

      const sectionSpecific = Math.random() > 0.5;
      const sectionId =
        sectionSpecific && universitySections.length > 0
          ? universitySections[
              Math.floor(Math.random() * universitySections.length)
            ].section_id
          : null;

      const pocId =
        universityEmployees.length > 0
          ? universityEmployees[
              Math.floor(Math.random() * universityEmployees.length)
            ].id
          : null;

      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setHours(
        startDate.getHours() + Math.floor(Math.random() * 5) + 1
      );

      const eventId = `evt-${id}`;
      const eventType = eventTypes[eventTypeIndex];
      const eventTitle = `Event ${id}`;

      events.push({
        event_id: eventId,
        name: eventTitle,
        venue: locations[locationIndex],
        start_datetime: startDate.toISOString(),
        end_datetime: endDate.toISOString(),
        status: statuses[statusIndex],
        poc: pocId || "",
        event_type: eventType,
        university_id: university.university_id,
        section_id: sectionId,
        user_id: null,
        created_at: randomPastDate(30),
        id: eventId,
        title: eventTitle,
        description: `Description for Event number ${id}`,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        location: locations[locationIndex],
        poc_employee_id: pocId,
        created_by: null,
        updated_at: randomPastDate(10),
      });
      id++;
    }
  }

  return events;
};

export const generateAlerts = (
  universities: University[],
  sections: Section[],
  students: Student[]
): Alert[] => {
  const alerts: Alert[] = [];
  const alertTypes = ["Attendance", "Academic", "Fee", "Event", "System"];
  const severities: RiskLevel[] = ["low", "medium", "high"];
  const categories: ("student" | "academic" | "facility" | "general")[] = [
    "student",
    "academic",
    "facility",
    "general",
  ];

  let id = 1;

  for (const university of universities) {
    const alertCount = 2 + Math.floor(Math.random() * 4);

    for (let i = 0; i < alertCount; i++) {
      const typeIndex = Math.floor(Math.random() * alertTypes.length);
      const severityIndex = Math.floor(Math.random() * severities.length);
      const categoryIndex = Math.floor(Math.random() * categories.length);
      const alertId = `alt-${id}`;
      const alertTitle = `${alertTypes[typeIndex]} Alert`;

      alerts.push({
        id: alertId,
        title: alertTitle,
        message: `${alertTypes[typeIndex]} alert for ${university.name}`,
        severity: severities[severityIndex],
        category: categories[categoryIndex],
        is_read: Math.random() > 0.7,
        university_id: university.university_id,
        created_at: randomPastDate(30),
        updated_at: randomPastDate(10),
        alert_type: alertTypes[typeIndex],
        entity_type: null,
        entity_id: null,
      });
      id++;
    }

    const universitySections = sections.filter(
      (s) => s.university_id === university.university_id
    );
    for (const section of universitySections) {
      if (Math.random() > 0.7) {
        const typeIndex = Math.floor(Math.random() * alertTypes.length);
        const severityIndex = Math.floor(Math.random() * severities.length);
        const categoryIndex = Math.floor(Math.random() * categories.length);
        const alertId = `alt-${id}`;
        const alertTitle = `${alertTypes[typeIndex]} Alert`;

        alerts.push({
          id: alertId,
          title: alertTitle,
          message: `${alertTypes[typeIndex]} alert for ${section.name} in ${university.name}`,
          severity: severities[severityIndex],
          category: categories[categoryIndex],
          is_read: Math.random() > 0.7,
          university_id: university.university_id,
          section_id: section.section_id,
          created_at: randomPastDate(30),
          updated_at: randomPastDate(10),
          alert_type: alertTypes[typeIndex],
          entity_type: "section",
          entity_id: section.section_id,
        });
        id++;
      }
    }

    const highRiskStudents = students.filter(
      (s) =>
        s.university_id === university.university_id && s.risk_level === "high"
    );

    for (const student of highRiskStudents) {
      if (Math.random() > 0.5) {
        const typeIndex = Math.floor(Math.random() * alertTypes.length);
        const categoryIndex = Math.floor(Math.random() * categories.length);
        const alertId = `alt-${id}`;
        const alertTitle = `${alertTypes[typeIndex]} Alert`;

        alerts.push({
          id: alertId,
          title: alertTitle,
          message: `${alertTypes[typeIndex]} alert for student ${student.name}`,
          severity: "high",
          category: categories[categoryIndex],
          is_read: Math.random() > 0.7,
          university_id: university.university_id,
          section_id: student.section_id,
          created_at: randomPastDate(30),
          updated_at: randomPastDate(10),
          alert_type: alertTypes[typeIndex],
          entity_type: "student",
          entity_id: student.student_id,
        });
        id++;
      }
    }
  }

  return alerts;
};

export const generateSlots = (
  sections: Section[],
  employees: Employee[],
  events: Event[]
): Slot[] => {
  const slots: Slot[] = [];
  const slotTypes: (
    | "exam"
    | "learning_session"
    | "guest_lecture"
    | "topic_discussion"
  )[] = ["exam", "learning_session", "guest_lecture", "topic_discussion"];
  const slotNames = [
    "Final Exam",
    "Mid-term Exam",
    "Weekly Quiz",
    "Lecture",
    "Tutorial",
    "Lab Session",
    "Workshop",
    "Guest Speaker Session",
    "Industry Expert Talk",
    "Topic Discussion",
    "Group Discussion",
    "Case Study Analysis",
  ];

  let id = 1;

  const today = new Date();
  const threeMonthsLater = addDays(today, 90);

  for (const section of sections) {
    const universityEmployees = employees.filter(
      (e) => e.university_id === section.university_id && e.is_instructor
    );

    if (universityEmployees.length === 0) continue;

    for (const slotType of slotTypes) {
      let slotCount;

      switch (slotType) {
        case "exam":
          slotCount = 2 + Math.floor(Math.random() * 3);
          break;
        case "learning_session":
          slotCount = 15 + Math.floor(Math.random() * 10);
          break;
        case "guest_lecture":
          slotCount = 1 + Math.floor(Math.random() * 2);
          break;
        case "topic_discussion":
          slotCount = 4 + Math.floor(Math.random() * 6);
          break;
      }

      let typeSpecificNames;
      switch (slotType) {
        case "exam":
          typeSpecificNames = slotNames.slice(0, 3);
          break;
        case "learning_session":
          typeSpecificNames = slotNames.slice(3, 7);
          break;
        case "guest_lecture":
          typeSpecificNames = slotNames.slice(7, 9);
          break;
        case "topic_discussion":
          typeSpecificNames = slotNames.slice(9, 12);
          break;
      }

      for (let i = 0; i < slotCount; i++) {
        const dayOfPeriod =
          Math.floor((90 / slotCount) * i) + Math.floor(Math.random() * 7) - 3; // Add some randomness
        const slotDate = addDays(today, dayOfPeriod);

        if (slotDate > threeMonthsLater) continue;

        const startTime = randomTimeInWorkingHours(slotDate);
        const durationMinutes = randomDuration();
        const endTime = addMinutes(startTime, durationMinutes);

        const employeeIndex = Math.floor(
          Math.random() * universityEmployees.length
        );
        const responsiblePerson = universityEmployees[employeeIndex].id;

        const linkToEvent = Math.random() < 0.1;
        let linkedEventId = null;
        if (linkToEvent) {
          const sectionEvents = events.filter(
            (e) => e.section_id === section.section_id
          );
          if (sectionEvents.length > 0) {
            const eventIndex = Math.floor(Math.random() * sectionEvents.length);
            linkedEventId = sectionEvents[eventIndex].event_id;
          }
        }

        const nameIndex = Math.floor(Math.random() * typeSpecificNames.length);
        const name = `${typeSpecificNames[nameIndex]} ${i + 1}`;

        const slotId = `slot-${id}`;
        slots.push({
          slot_id: slotId,
          slot_name: name,
          slot_type: slotType,
          section_id: section.section_id,
          responsible_person: responsiblePerson,
          start_datetime: startTime.toISOString(),
          end_datetime: endTime.toISOString(),
          linked_event_id: linkedEventId,
          linked_topic_id: null,
          created_at: randomPastDate(30),
        });

        id++;
      }
    }
  }

  return slots;
};

export const generateAllDummyData = () => {
  const universities = generateUniversities(3);

  let allSections: Section[] = [];
  for (const university of universities) {
    const sectionCount = 3 + Math.floor(Math.random() * 3);
    allSections = [
      ...allSections,
      ...generateSections(university.university_id, sectionCount),
    ];
  }

  const students = generateStudents(500, universities, allSections);

  const subjects = generateSubjects(universities, allSections);

  const plannedSessions = generatePlannedSessions(subjects);

  const actualSessions = generateActualSessions(plannedSessions);

  const employees = generateEmployees(universities);

  const events = generateEvents(universities, allSections, employees);

  const alerts = generateAlerts(universities, allSections, students);

  const slots = generateSlots(allSections, employees, events);

  return {
    universities,
    sections: allSections,
    students,
    subjects,
    plannedSessions,
    actualSessions,
    employees,
    events,
    alerts,
    slots,
  };
};

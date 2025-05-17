import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, CheckSquare, XSquare, AlertCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Student, Section } from "@/types";
import { useStudents } from "@/hooks/useStudents";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StudentAttendanceManagerProps {
  student?: Student;
  universityId: string;
  sections: Section[];
}

interface AttendanceRecord {
  attendance_id: string;
  student_id: string;
  date: string;
  present: boolean;
  leave_reason: string | null;
  created_at: string;
}

const StudentAttendanceManager: React.FC<StudentAttendanceManagerProps> = ({ 
  student, 
  universityId,
  sections
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [leaveReason, setLeaveReason] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  
  const { toast } = useToast();
  const { 
    students, 
    getOrCreateAttendance, 
    updateAttendance, 
    getStudentsAttendanceForDate 
  } = useStudents(universityId);

  // If we're viewing a single student, just show that student's attendance
  // Otherwise, filter by selected section
  useEffect(() => {
    if (student) {
      setFilteredStudents([student]);
    } else if (selectedSectionId) {
      setFilteredStudents(students.filter(s => s.section_id === selectedSectionId));
    } else {
      setFilteredStudents([]);
    }
  }, [student, students, selectedSectionId]);

  // Handle section change
  const handleSectionChange = (value: string) => {
    setSelectedSectionId(value);
  };

  // When date or filtered students change, fetch attendance records
  useEffect(() => {
    const fetchAttendanceForDate = async () => {
      if (selectedDate && filteredStudents.length > 0) {
        setIsLoading(true);
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const studentIds = filteredStudents.map(s => s.student_id);
        
        // Get attendance records for all students for this date
        const records = await getStudentsAttendanceForDate(studentIds, formattedDate);
        setAttendanceRecords(records as AttendanceRecord[]);
        setIsLoading(false);
      }
    };

    fetchAttendanceForDate();
  }, [selectedDate, filteredStudents, getStudentsAttendanceForDate]);

  // Create or fetch attendance record for selected date
  const handleDateSelect = async (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    // Attendance records will be fetched by the useEffect that depends on selectedDate
  };

  // Mark student as present for selected date
  const markPresent = async (attendanceId: string) => {
    setIsLoading(true);
    const updated = await updateAttendance(attendanceId, true);
    if (updated) {
      setAttendanceRecords(prev => 
        prev.map(r => r.attendance_id === attendanceId ? { ...r, present: true } : r)
      );
    }
    setIsLoading(false);
  };

  // Mark student as absent for selected date
  const markAbsent = async (attendanceId: string, studentId: string) => {
    setIsLoading(true);
    // Get the current leave reason for this specific record
    const currentReason = attendanceRecords.find(r => r.student_id === studentId)?.leave_reason || "";
    
    const updated = await updateAttendance(attendanceId, false, currentReason);
    if (updated) {
      setAttendanceRecords(prev => 
        prev.map(r => r.attendance_id === attendanceId ? { ...r, present: false, leave_reason: currentReason } : r)
      );
    }
    setIsLoading(false);
  };

  // Update leave reason for a specific student
  const updateLeaveReason = async (attendanceId: string, reason: string) => {
    const record = attendanceRecords.find(r => r.attendance_id === attendanceId);
    if (!record || record.present) return;
    
    setIsLoading(true);
    const updated = await updateAttendance(attendanceId, false, reason);
    if (updated) {
      setAttendanceRecords(prev => 
        prev.map(r => r.attendance_id === attendanceId ? { ...r, leave_reason: reason } : r)
      );
    }
    setIsLoading(false);
  };

  // Get student name by ID
  const getStudentName = (studentId: string) => {
    const student = filteredStudents.find(s => s.student_id === studentId);
    return student ? student.name : "Unknown Student";
  };

  // Get section name
  const getSectionName = (sectionId: string) => {
    const section = sections.find(s => s.section_id === sectionId);
    return section ? section.name : "Unknown Section";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, 'PPP') : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => date > new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Only show section selector when not viewing a single student */}
        {!student && (
          <div className="w-full sm:w-64">
            <Select 
              value={selectedSectionId} 
              onValueChange={handleSectionChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                  <SelectItem key={section.section_id} value={section.section_id}>
                    {section.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="py-8 text-center">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading attendance records...</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="py-8 text-center border rounded-md">
          <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            {!selectedSectionId ? "Please select a section to view attendance" : "No students found in this section"}
          </p>
        </div>
      ) : (
        <div className="border rounded-md">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-semibold">
              {student 
                ? `Attendance for ${student.name}`
                : `Attendance for ${getSectionName(selectedSectionId)} - ${attendanceRecords.length} Student(s)`}
            </h3>
            {selectedDate && (
              <Badge variant="outline" className="ml-2">
                {format(selectedDate, 'PPP')}
              </Badge>
            )}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reason (If absent)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords.length > 0 ? (
                attendanceRecords.map((record) => {
                  const currentStudent = filteredStudents.find(s => s.student_id === record.student_id);
                  if (!currentStudent) return null;
                  
                  return (
                    <TableRow key={record.attendance_id}>
                      <TableCell className="font-medium">{getStudentName(record.student_id)}</TableCell>
                      <TableCell>{currentStudent.roll_number}</TableCell>
                      <TableCell>
                        {record.present ? (
                          <Badge variant="success" className="bg-green-100 text-green-700">
                            <CheckSquare className="h-4 w-4 mr-1" /> Present
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="bg-red-100 text-red-700">
                            <XSquare className="h-4 w-4 mr-1" /> Absent
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        {!record.present && (
                          <Input
                            value={record.leave_reason || ""}
                            onChange={(e) => updateLeaveReason(record.attendance_id, e.target.value)}
                            placeholder="Reason for absence"
                            className="text-sm"
                          />
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant={record.present ? "default" : "outline"}
                            size="sm"
                            onClick={() => markPresent(record.attendance_id)}
                            disabled={isLoading || record.present}
                          >
                            <CheckSquare className="h-4 w-4 mr-1" /> Present
                          </Button>
                          <Button
                            variant={!record.present ? "default" : "outline"}
                            size="sm"
                            onClick={() => markAbsent(record.attendance_id, record.student_id)}
                            disabled={isLoading || !record.present}
                          >
                            <XSquare className="h-4 w-4 mr-1" /> Absent
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <AlertCircle className="h-6 w-6 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      No attendance records available for this date
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default StudentAttendanceManager;

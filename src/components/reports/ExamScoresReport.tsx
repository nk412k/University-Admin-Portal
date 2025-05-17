import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { FileDown, Users, School, Calendar, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Section {
  section_id: string;
  section_name: string;
  university_name: string;
  exams: Record<string, Exam>;
}

interface Exam {
  event_id: string;
  event_name: string;
  event_date: string;
  total_students: number;
  pass_count: number;
  fail_count: number;
  students: ExamScore[];
}

interface SelectedExam extends Exam {
  section_name: string;
  university_name: string;
}

interface ExamScore {
  student_id: string;
  student_name: string;
  roll_number: string;
  score_obtained: number;
  total_score: number;
  pass_status: boolean;
  percentage: string;
}

interface ExamScoreData {
  event_id: string;
  event_name: string;
  event_date: string;
  section_name: string;
  university_name: string;
  total_students: number;
  pass_count: number;
  fail_count: number;
  students: ExamScore[];
}

const getGroupedExamScores = async (): Promise<Section[]> => {
  try {
    const { data, error } = await supabase.from("exam_scores").select(`
      *,
      students:student_id (
        name,
        roll_number,
        section_id,
        sections:section_id (
          name,
          university_id,
          universities:university_id (name)
        )
      ),
      events:event_id (
        name,
        start_datetime,
        end_datetime
      )
    `);

    if (error) {
      console.error("Error fetching exam scores:", error);
      return [];
    }

    const groupedBySection: Record<string, Section> = {};

    data?.forEach((score) => {
      const sectionId = score.students?.section_id;
      const sectionName = score.students?.sections?.name || "Unknown Section";
      const universityName =
        score.students?.sections?.universities?.name || "Unknown University";

      if (!groupedBySection[sectionId]) {
        groupedBySection[sectionId] = {
          section_id: sectionId,
          section_name: sectionName,
          university_name: universityName,
          exams: {},
        };
      }

      const eventId = score.event_id;
      const eventName = score.events?.name || "Unknown Exam";
      const eventDate = score.events?.start_datetime
        ? format(new Date(score.events.start_datetime), "yyyy-MM-dd")
        : "Unknown Date";

      const examKey = `${eventId}`;
      if (!groupedBySection[sectionId].exams[examKey]) {
        groupedBySection[sectionId].exams[examKey] = {
          event_id: eventId,
          event_name: eventName,
          event_date: eventDate,
          total_students: 0,
          pass_count: 0,
          fail_count: 0,
          students: [],
        };
      }

      groupedBySection[sectionId].exams[examKey].students.push({
        student_id: score.student_id,
        student_name: score.students?.name || "Unknown",
        roll_number: score.students?.roll_number || "N/A",
        score_obtained: score.score_obtained,
        total_score: score.total_score,
        pass_status: score.pass_status,
        percentage: ((score.score_obtained / score.total_score) * 100).toFixed(
          2
        ),
      });

      groupedBySection[sectionId].exams[examKey].total_students++;
      if (score.pass_status) {
        groupedBySection[sectionId].exams[examKey].pass_count++;
      } else {
        groupedBySection[sectionId].exams[examKey].fail_count++;
      }
    });

    return Object.values(groupedBySection);
  } catch (error) {
    console.error("Exception fetching exam scores:", error);
    return [];
  }
};

const ExamScoresReport: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState<SelectedExam | null>(null);
  const [isExamDetailsOpen, setIsExamDetailsOpen] = useState(false);

  useEffect(() => {
    const loadExamScores = async () => {
      try {
        setIsLoading(true);
        const data = await getGroupedExamScores();
        setSections(data);
      } catch (error) {
        console.error("Error loading exam scores:", error);
        toast({
          title: "Failed to load exam scores",
          description:
            "There was a problem loading the exam scores. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadExamScores();
  }, []);

  const viewExamDetails = (section: Section, exam: Exam) => {
    setSelectedExam({
      ...exam,
      section_name: section.section_name,
      university_name: section.university_name,
    });
    setIsExamDetailsOpen(true);
  };

  const generateExamScoresPDF = (examData: ExamScoreData): void => {
    try {
      const doc = new jsPDF();
      const reportDate = format(new Date(), "dd/MM/yyyy");
      const examDate = format(new Date(examData.event_date), "dd/MM/yyyy");

      doc.setFontSize(20);
      doc.text(`${examData.university_name}`, 105, 15, { align: "center" });

      doc.setFontSize(16);
      doc.text(`${examData.event_name} - Score Report`, 105, 25, {
        align: "center",
      });

      doc.setFontSize(12);
      doc.text(`Section: ${examData.section_name}`, 20, 40);
      doc.text(`Exam Date: ${examDate}`, 140, 40);
      doc.text(`Report Date: ${reportDate}`, 140, 48);

      const totalStudents = examData.total_students;
      const passPercentage =
        totalStudents > 0
          ? Math.round((examData.pass_count / totalStudents) * 100)
          : 0;

      doc.text(`Total Students: ${totalStudents}`, 20, 56);
      doc.text(`Passed: ${examData.pass_count}`, 70, 56);
      doc.text(`Failed: ${examData.fail_count}`, 120, 56);
      doc.text(`Pass %: ${passPercentage}%`, 170, 56);

      const tableBody = examData.students.map((student) => [
        student.roll_number,
        student.student_name,
        `${student.score_obtained} / ${student.total_score}`,
        `${student.percentage}%`,
        student.pass_status ? "Pass" : "Fail",
      ]);

      autoTable(doc, {
        startY: 65,
        head: [
          ["Roll Number", "Student Name", "Marks", "Percentage", "Status"],
        ],
        body: tableBody,
        headStyles: { fillColor: [66, 139, 202] },
      });

      const finalY =
        (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
          .finalY + 20;
      doc.text("Prepared By: _________________", 20, finalY);
      doc.text("Verified By: _________________", 120, finalY);

      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(
          `Page ${i} of ${pageCount}`,
          105,
          doc.internal.pageSize.height - 10,
          { align: "center" }
        );
        doc.text(
          `Generated on: ${format(new Date(), "dd/MM/yyyy HH:mm")}`,
          105,
          doc.internal.pageSize.height - 5,
          { align: "center" }
        );
      }

      doc.save(
        `${examData.event_name.replace(
          /\s+/g,
          "_"
        )}_${examData.section_name.replace(/\s+/g, "_")}_${examDate.replace(
          /\//g,
          "-"
        )}.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  };

  const handleDownloadPDF = (exam: ExamScoreData) => {
    try {
      generateExamScoresPDF(exam);
      toast({
        title: "Success",
        description: "Exam scores PDF has been downloaded.",
      });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast({
        title: "Download failed",
        description:
          "There was a problem generating the PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Exam Score Reports
          </h2>
          <p className="text-muted-foreground">
            View exam scores categorized by section and exam
          </p>
        </div>
      </div>

      <div className="bg-muted/20 p-4 rounded-lg flex items-center gap-3 text-sm">
        <FileDown className="h-5 w-5 text-primary" />
        <p>
          You can download PDF reports for each exam by clicking the download
          button next to the exam title or inside the expanded view.
        </p>
      </div>

      {sections.length > 0 ? (
        <div className="space-y-6">
          {sections.map((section) => (
            <Card key={section.section_id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <School className="h-5 w-5 text-muted-foreground" />
                      {section.section_name}
                    </CardTitle>
                    <CardDescription>{section.university_name}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                  {Object.values(section.exams).map((exam: Exam) => (
                    <AccordionItem key={exam.event_id} value={exam.event_id}>
                      <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 hover:no-underline">
                        <div className="flex flex-1 items-center justify-between pr-4">
                          <div className="flex items-center gap-3">
                            <BookOpen className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-left font-medium">
                                {exam.event_name}
                              </p>
                              <p className="text-left text-sm text-muted-foreground">
                                {format(
                                  new Date(exam.event_date),
                                  "dd MMM yyyy"
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end">
                              <p className="text-sm font-medium">
                                {exam.total_students} Students
                              </p>
                              <div className="flex gap-2">
                                <Badge
                                  variant="outline"
                                  className="bg-green-50"
                                >
                                  {exam.pass_count} Pass
                                </Badge>
                                <Badge variant="destructive">
                                  {exam.fail_count} Fail
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-2 h-8 w-8 flex-shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadPDF({
                                  ...exam,
                                  section_name: section.section_name,
                                  university_name: section.university_name,
                                });
                              }}
                            >
                              <FileDown className="h-4 w-4" />
                              <span className="sr-only">Download PDF</span>
                            </Button>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pt-2 pb-4">
                        <div className="rounded-md border overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Roll No.</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="text-right">
                                  Marks
                                </TableHead>
                                <TableHead className="text-center">
                                  Status
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {exam.students.map((student: ExamScore) => (
                                <TableRow key={student.student_id}>
                                  <TableCell>{student.roll_number}</TableCell>
                                  <TableCell>{student.student_name}</TableCell>
                                  <TableCell className="text-right">
                                    {student.score_obtained} /{" "}
                                    {student.total_score} ({student.percentage}
                                    %)
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Badge
                                      variant={
                                        student.pass_status
                                          ? "outline"
                                          : "destructive"
                                      }
                                    >
                                      {student.pass_status ? "Pass" : "Fail"}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-md border">
          <p className="text-muted-foreground">No exam scores found.</p>
        </div>
      )}

      <Dialog open={isExamDetailsOpen} onOpenChange={setIsExamDetailsOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          {selectedExam ? (
            <>
              <DialogHeader>
                <DialogTitle>{selectedExam.event_name}</DialogTitle>
                <DialogDescription>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Exam Date:{" "}
                        {format(
                          new Date(selectedExam.event_date),
                          "dd MMM yyyy"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <School className="h-4 w-4 text-muted-foreground" />
                      <span>University: {selectedExam.university_name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Section: {selectedExam.section_name}</span>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="bg-secondary/50 p-4 rounded-md">
                    <div className="text-sm text-muted-foreground">
                      Total Students
                    </div>
                    <div className="text-2xl font-bold">
                      {selectedExam.total_students}
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-md">
                    <div className="text-sm text-muted-foreground">
                      Pass Rate
                    </div>
                    <div className="text-2xl font-bold text-green-700">
                      {Math.round(
                        (selectedExam.pass_count /
                          selectedExam.total_students) *
                          100
                      )}
                      %
                    </div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-md">
                    <div className="text-sm text-muted-foreground">
                      Fail Rate
                    </div>
                    <div className="text-2xl font-bold text-red-700">
                      {Math.round(
                        (selectedExam.fail_count /
                          selectedExam.total_students) *
                          100
                      )}
                      %
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="text-lg font-semibold mb-2">Student Scores</div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Roll No.</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Marks</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedExam.students.length > 0 ? (
                        selectedExam.students.map((student: ExamScore) => (
                          <TableRow key={student.student_id}>
                            <TableCell>{student.roll_number}</TableCell>
                            <TableCell>{student.student_name}</TableCell>
                            <TableCell className="text-right font-medium">
                              {student.score_obtained} / {student.total_score} (
                              {student.percentage}%)
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant={
                                  student.pass_status
                                    ? "outline"
                                    : "destructive"
                                }
                              >
                                {student.pass_status ? "Pass" : "Fail"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center">
                            No student scores available.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={() => setIsExamDetailsOpen(false)}
                  variant="outline"
                >
                  Close
                </Button>
                <Button onClick={() => handleDownloadPDF(selectedExam)}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="text-center py-8">Exam details not available.</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExamScoresReport;

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
import { FileDown, Download, BookOpen, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import {
  ExamReport,
  ExamReportWithDetails,
  fetchExamReports,
  fetchExamReportDetails,
} from "@/utils/examReportUtils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generateExamReportPDF = (report: ExamReportWithDetails): void => {
  try {
    const doc = new jsPDF();
    const reportDate = format(new Date(), "dd/MM/yyyy");
    const examDate = format(new Date(report.exam_date), "dd/MM/yyyy");

    doc.setFontSize(20);
    doc.text(`${report.university_name || "University"}`, 105, 15, {
      align: "center",
    });

    doc.setFontSize(16);
    doc.text(`${report.subject_name} Exam Report`, 105, 25, {
      align: "center",
    });

    doc.setFontSize(12);
    doc.text(`Section: ${report.section_name || "Unknown"}`, 20, 40);
    doc.text(`Subject: ${report.subject_name || "Unknown"}`, 20, 48);
    doc.text(`Exam Date: ${examDate}`, 140, 40);
    doc.text(`Report Date: ${reportDate}`, 140, 48);

    doc.text(`Total Marks: ${report.total_marks}`, 20, 56);
    doc.text(`Pass Marks: ${report.pass_marks}`, 70, 56);

    const totalStudents = report.students.length;
    const passedStudents = report.students.filter(
      (student) => student.marks_obtained >= report.pass_marks
    ).length;
    const passPercentage =
      totalStudents > 0
        ? Math.round((passedStudents / totalStudents) * 100)
        : 0;

    doc.text(`Total Students: ${totalStudents}`, 20, 64);
    doc.text(`Passed: ${passedStudents}`, 70, 64);
    doc.text(`Pass %: ${passPercentage}%`, 120, 64);

    const tableBody = report.students.map((student) => [
      student.student_id,
      student.student_name,
      student.marks_obtained.toString(),
      student.grade || "-",
      student.pass_status ? "Pass" : "Fail",
      student.remarks || "",
    ]);

    autoTable(doc, {
      startY: 75,
      head: [
        ["Student ID", "Student Name", "Marks", "Grade", "Status", "Remarks"],
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
      `${report.subject_name.replace(
        /\s+/g,
        "_"
      )}_${report.section_name?.replace(/\s+/g, "_")}_${examDate.replace(
        /\//g,
        "-"
      )}.pdf`
    );
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};

const ExamReports: React.FC = () => {
  const [reports, setReports] = useState<ExamReport[]>([]);
  const [selectedReport, setSelectedReport] =
    useState<ExamReportWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReportDetailsOpen, setIsReportDetailsOpen] = useState(false);
  const [isReportDetailsLoading, setIsReportDetailsLoading] = useState(false);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setIsLoading(true);
        const data = await fetchExamReports();
        setReports(data);
      } catch (error) {
        console.error("Error loading reports:", error);
        toast({
          title: "Failed to load exam reports",
          description:
            "There was a problem loading the exam reports. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, []);

  const viewReportDetails = async (reportId: string) => {
    try {
      setIsReportDetailsLoading(true);
      const details = await fetchExamReportDetails(reportId);

      if (details) {
        setSelectedReport(details);
        setIsReportDetailsOpen(true);
      } else {
        toast({
          title: "Report not found",
          description: "The requested report details could not be loaded.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error loading report details:", error);
      toast({
        title: "Error",
        description: "Failed to load report details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsReportDetailsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!selectedReport) return;

    try {
      generateExamReportPDF(selectedReport);
      toast({
        title: "Success",
        description: "Exam report PDF has been downloaded.",
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
          <h2 className="text-3xl font-bold tracking-tight">Exam Reports</h2>
          <p className="text-muted-foreground">
            View and download exam reports for all sections
          </p>
        </div>
      </div>

      {reports.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
            <CardDescription>{reports.length} reports found</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Section
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    University
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Exam Date
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">
                      {report.subject_name}
                      <div className="md:hidden mt-1 text-xs text-muted-foreground">
                        {report.section_name} -{" "}
                        {format(new Date(report.exam_date), "dd MMM yyyy")}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {report.section_name}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {report.university_name}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {format(new Date(report.exam_date), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewReportDetails(report.id)}
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-md border">
          <p className="text-muted-foreground">No exam reports found.</p>
        </div>
      )}

      {/* Report Details Dialog */}
      <Dialog open={isReportDetailsOpen} onOpenChange={setIsReportDetailsOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          {isReportDetailsLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
            </div>
          ) : selectedReport ? (
            <>
              <DialogHeader>
                <DialogTitle>
                  {selectedReport.subject_name} Exam Report
                </DialogTitle>
                <DialogDescription>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Exam Date:{" "}
                        {format(
                          new Date(selectedReport.exam_date),
                          "dd MMM yyyy"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>Subject: {selectedReport.subject_name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Section: {selectedReport.section_name}</span>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="bg-secondary/50 p-4 rounded-md">
                    <div className="text-sm text-muted-foreground">
                      Total Marks
                    </div>
                    <div className="text-2xl font-bold">
                      {selectedReport.total_marks}
                    </div>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-md">
                    <div className="text-sm text-muted-foreground">
                      Pass Marks
                    </div>
                    <div className="text-2xl font-bold">
                      {selectedReport.pass_marks}
                    </div>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-md">
                    <div className="text-sm text-muted-foreground">
                      Pass Percentage
                    </div>
                    <div className="text-2xl font-bold">
                      {selectedReport.pass_percentage}%
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="text-lg font-semibold mb-2">Student Marks</div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Marks</TableHead>
                        <TableHead className="text-right hidden sm:table-cell">
                          Grade
                        </TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedReport.students.length > 0 ? (
                        selectedReport.students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>{student.student_id}</TableCell>
                            <TableCell>{student.student_name}</TableCell>
                            <TableCell className="text-right font-medium">
                              {student.marks_obtained} /{" "}
                              {selectedReport.total_marks}
                            </TableCell>
                            <TableCell className="text-right hidden sm:table-cell">
                              {student.grade || "-"}
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
                          <TableCell colSpan={5} className="text-center">
                            No student marks available.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={() => setIsReportDetailsOpen(false)}
                  variant="outline"
                >
                  Close
                </Button>
                <Button onClick={handleDownloadPDF}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="text-center py-8">
              Report details not available.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExamReports;

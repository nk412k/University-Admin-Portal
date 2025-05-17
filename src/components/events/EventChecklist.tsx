import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format, isAfter, parseISO } from "date-fns";
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
} from "lucide-react";
import { EventChecklistStatus } from "./EventChecklistStatus";
import {
  useEventChecklist,
  updateChecklistItemStatus,
  ChecklistDataItem,
} from "@/hooks/useEventChecklists";
import { ChecklistItemStatus } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { PrintableChecklist } from "./PrintableChecklist";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface EventChecklistProps {
  eventId: string;
  className?: string;
}

export const EventChecklist: React.FC<EventChecklistProps> = ({
  eventId,
  className,
}) => {
  const { eventChecklist, checklist, items, isLoading, error, refetch } =
    useEventChecklist(eventId);
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [savingItemId, setSavingItemId] = useState<string | null>(null);
  const printableRef = useRef<HTMLDivElement>(null);
  const [eventDetails, setEventDetails] = useState<{
    name: string;
    date: string;
  } | null>(null);

  React.useEffect(() => {
    if (eventId) {
      const fetchEventDetails = async () => {
        try {
          const { data, error } = await supabase
            .from("events")
            .select("name, start_datetime")
            .eq("event_id", eventId)
            .single();

          if (error) throw error;
          if (data) {
            setEventDetails({
              name: data.name,
              date: data.start_datetime,
            });
          }
        } catch (error) {
          console.error("Error fetching event details:", error);
        }
      };

      fetchEventDetails();
    }
  }, [eventId]);

  const handleDownloadPDF = () => {
    if (!eventDetails || !checklist || !eventChecklist) {
      toast({
        title: "Cannot download PDF",
        description: "Required data is missing",
        variant: "destructive",
      });
      return;
    }

    try {
      const doc = new jsPDF();

      doc.setTextColor(0, 0, 0);

      doc.setFontSize(18);
      doc.text(
        `${checklist.type.replace("_", " ").toUpperCase()} CHECKLIST`,
        doc.internal.pageSize.width / 2,
        20,
        { align: "center" }
      );

      doc.setFontSize(14);
      doc.text(eventDetails.name, doc.internal.pageSize.width / 2, 30, {
        align: "center",
      });

      doc.setFontSize(10);
      doc.text(
        `Date: ${format(parseISO(eventDetails.date), "MMMM d, yyyy")}`,
        doc.internal.pageSize.width / 2,
        40,
        { align: "center" }
      );
      doc.text(
        `Due by: ${format(parseISO(eventChecklist.due_date), "MMMM d, yyyy")}`,
        doc.internal.pageSize.width / 2,
        46,
        { align: "center" }
      );

      doc.setFontSize(12);
      doc.text(`Status: ${eventChecklist.status.toUpperCase()}`, 20, 56);

      autoTable(doc, {
        startY: 65,
        head: [["Item", "Status", "Remarks"]],
        body: items.map((item) => [
          item.description,
          item.status?.status.toUpperCase() || "PENDING",
          item.status?.remarks || "-",
        ]),
        headStyles: { fillColor: [66, 135, 245] },
      });

      const finalY =
        (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
          .finalY + 20;

      doc.text("Verified By:", 20, finalY);
      doc.line(20, finalY + 25, 100, finalY + 25);
      doc.text("Signature / Date", 50, finalY + 30);

      const filename = `${checklist.type.replace(
        "_",
        "-"
      )}-checklist-${eventDetails.name.replace(/\s+/g, "-").toLowerCase()}.pdf`;
      doc.save(filename);

      toast({
        title: "Success",
        description: "PDF downloaded successfully",
      });
    } catch (err) {
      console.error("Error generating PDF:", err);
      toast({
        title: "Download failed",
        description: "Could not generate PDF",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            Loading Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex animate-pulse items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-gray-200"></div>
                <div className="h-4 flex-1 rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !eventChecklist || !checklist) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-red-500">
            Checklist Not Available
          </CardTitle>
          <CardDescription>
            {error || "No checklist found for this event."}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const handleStatusChange = async (
    item: ChecklistDataItem,
    newStatus: ChecklistItemStatus
  ) => {
    if (!item.status?.status_id) return;

    setSavingItemId(item.item_id);
    const success = await updateChecklistItemStatus(
      item.status.status_id,
      newStatus,
      remarks[item.item_id] || item.status?.remarks
    );

    if (success) {
      await refetch();
    }

    setSavingItemId(null);
  };

  const isDueDatePassed = eventChecklist.due_date
    ? isAfter(new Date(), parseISO(eventChecklist.due_date))
    : false;

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>
                {checklist.type.replace("_", " ").toUpperCase()} Checklist
              </CardTitle>
              <CardDescription>
                Track progress for this {checklist.type.replace("_", " ")}
              </CardDescription>
            </div>
            <div className="flex flex-col items-start gap-1 sm:items-end">
              <div className="flex items-center gap-2">
                <EventChecklistStatus status={eventChecklist.status} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden md:inline">Download PDF</span>
                </Button>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  Due:{" "}
                  {format(parseISO(eventChecklist.due_date), "MMM d, yyyy")}
                  {isDueDatePassed && (
                    <span className="ml-1 text-red-500">(Overdue)</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
            {items.length === 0 ? (
              <div className="rounded-md border border-dashed p-4 text-center text-gray-500">
                No checklist items found
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.item_id}
                  className="space-y-2 rounded-md border p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      {item.status?.status === "completed" ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />
                      ) : item.status?.status === "in_progress" ? (
                        <Clock className="mt-0.5 h-5 w-5 text-amber-500" />
                      ) : (
                        <AlertCircle className="mt-0.5 h-5 w-5 text-gray-400" />
                      )}
                      <div>
                        <p className="font-medium">{item.description}</p>
                        {item.status?.updated_at && (
                          <p className="text-xs text-gray-500">
                            Last updated:{" "}
                            {format(
                              parseISO(item.status.updated_at),
                              "MMM d, yyyy h:mm a"
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                    <Select
                      value={item.status?.status || "pending"}
                      onValueChange={(value) =>
                        handleStatusChange(item, value as ChecklistItemStatus)
                      }
                      disabled={savingItemId === item.item_id}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="overflow-y-auto">
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Textarea
                    placeholder="Add remarks for this item..."
                    className="h-20 text-sm"
                    value={
                      remarks[item.item_id] !== undefined
                        ? remarks[item.item_id]
                        : item.status?.remarks || ""
                    }
                    onChange={(e) =>
                      setRemarks((prev) => ({
                        ...prev,
                        [item.item_id]: e.target.value,
                      }))
                    }
                  />

                  {remarks[item.item_id] !== undefined &&
                    remarks[item.item_id] !== (item.status?.remarks || "") && (
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={async () => {
                            if (!item.status?.status_id) {
                              toast({
                                title: "Cannot save remarks",
                                description:
                                  "This item doesn't have a status record",
                                variant: "destructive",
                              });
                              return;
                            }

                            setSavingItemId(item.item_id);
                            const success = await updateChecklistItemStatus(
                              item.status.status_id,
                              item.status.status,
                              remarks[item.item_id]
                            );

                            if (success) {
                              // Clear local state
                              setRemarks((prev) => {
                                const updated = { ...prev };
                                delete updated[item.item_id];
                                return updated;
                              });

                              // Refetch data instead of relying on a page refresh
                              await refetch();
                            }
                            setSavingItemId(null);
                          }}
                          disabled={savingItemId === item.item_id}
                        >
                          {savingItemId === item.item_id
                            ? "Saving..."
                            : "Save Remarks"}
                        </Button>
                      </div>
                    )}
                </div>
              ))
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-gray-500">
            {items.filter((i) => i.status?.status === "completed").length} of{" "}
            {items.length} items completed
          </p>
        </CardFooter>
      </Card>

      <div className="hidden">
        <div ref={printableRef}>
          {eventDetails && checklist && eventChecklist && (
            <PrintableChecklist
              eventName={eventDetails.name}
              date={eventDetails.date}
              checklist={checklist}
              eventChecklist={eventChecklist}
              items={items}
            />
          )}
        </div>
      </div>
    </>
  );
};

import { supabase } from "@/integrations/supabase/client";

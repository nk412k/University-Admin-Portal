import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay, parseISO } from "date-fns";
import { usePlannedSessions } from "@/hooks/usePlannedSessions";
import { Slot } from "@/types";
import { Loader2 } from "lucide-react";

interface SessionDetailsProps {
  session: Slot;
}

const SessionDetails: React.FC<SessionDetailsProps> = ({ session }) => {
  return (
    <Card className="mb-2">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{session.topic}</CardTitle>
            <CardDescription>
              {session.start_datetime
                ? format(new Date(session.start_datetime), "h:mm a")
                : "TBD"}{" "}
              -
              {session.end_datetime
                ? format(new Date(session.end_datetime), "h:mm a")
                : "TBD"}
            </CardDescription>
          </div>
          <Badge variant={getBadgeVariantForSessionType(session.slot_type)}>
            {formatSessionType(session.slot_type)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-sm text-muted-foreground">
          <p>Section: {session.section_name || "Unknown Section"}</p>
          {session.responsible_person && (
            <p>Responsible: {session.responsible_person}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const formatSessionType = (type?: string): string => {
  if (!type) return "Session";

  switch (type) {
    case "exam":
      return "Exam";
    case "learning_session":
      return "Learning Session";
    case "guest_lecture":
      return "Guest Lecture";
    case "topic_discussion":
      return "Topic Discussion";
    default:
      return type.replace("_", " ");
  }
};

const getBadgeVariantForSessionType = (
  type?: string
): "default" | "secondary" | "destructive" | "outline" => {
  if (!type) return "default";

  switch (type) {
    case "exam":
      return "destructive";
    case "guest_lecture":
      return "secondary";
    case "topic_discussion":
      return "outline";
    case "learning_session":
    default:
      return "default";
  }
};

const AcademicCalendar: React.FC = () => {
  const { plannedSessions, isLoading } = usePlannedSessions();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const sessionsForSelectedDate = plannedSessions.filter(
    (session) =>
      session.start_datetime &&
      isSameDay(new Date(session.start_datetime), selectedDate)
  );

  const hasSessionsOnDay = (date: Date) => {
    return plannedSessions.some(
      (session) =>
        session.start_datetime &&
        isSameDay(new Date(session.start_datetime), date)
    );
  };

  const groupedSessions = sessionsForSelectedDate.reduce<
    Record<string, Slot[]>
  >((acc, session) => {
    if (session.start_datetime) {
      const timeSlot = format(new Date(session.start_datetime), "HH:mm");
      if (!acc[timeSlot]) {
        acc[timeSlot] = [];
      }
      acc[timeSlot].push(session);
    }
    return acc;
  }, {});

  const timeSlots = Object.keys(groupedSessions).sort();

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <Card className="md:w-1/2">
        <CardHeader>
          <CardTitle>Academic Calendar</CardTitle>
          <CardDescription>View scheduled sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                }
              }}
              modifiers={{
                hasSession: (date) => hasSessionsOnDay(date),
              }}
              modifiersStyles={{
                hasSession: { backgroundColor: "rgba(var(--primary), 0.3)" },
              }}
              className="rounded-md border"
            />
          )}
        </CardContent>
      </Card>

      <Card className="md:w-1/2">
        <CardHeader>
          <CardTitle>Sessions for {format(selectedDate, "PPPP")}</CardTitle>
          <CardDescription>
            {sessionsForSelectedDate.length} session(s) scheduled
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="h-[350px] overflow-y-auto pr-4">
              {timeSlots.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No sessions scheduled for this date
                </div>
              ) : (
                <>
                  {timeSlots.map((timeSlot) => (
                    <div key={timeSlot} className="mb-4">
                      <h3 className="font-medium text-sm text-muted-foreground mb-2">
                        {format(parseISO(`2025-01-01T${timeSlot}`), "h:mm a")}
                      </h3>
                      {groupedSessions[timeSlot].map((session) => (
                        <SessionDetails key={session.id} session={session} />
                      ))}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AcademicCalendar;

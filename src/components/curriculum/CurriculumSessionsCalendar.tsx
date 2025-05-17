import React, { useState } from "react";
import { format, parseISO, isToday, isSameDay, isSameMonth } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { DailySession } from "@/types/curriculum";
import { Skeleton } from "@/components/ui/skeleton";
import CurriculumStatusBadge from "./CurriculumStatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CurriculumSessionsCalendarProps {
  sessions: DailySession[];
  isLoading: boolean;
  currentMonth: Date;
  filterDate: Date | null;
  setFilterDate: (date: Date | null) => void;
}

const CurriculumSessionsCalendar: React.FC<CurriculumSessionsCalendarProps> = ({
  sessions,
  isLoading,
  currentMonth,
  filterDate,
  setFilterDate,
}) => {
  const [viewMode, setViewMode] = useState<"day" | "schedule">("day");

  const hasSessionsOnDay = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    return sessions.some((session) => session.date === formattedDate);
  };

  const hasOverdueSessions = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    return sessions.some(
      (session) =>
        session.date === formattedDate && session.status === "overdue"
    );
  };

  const selectedDateSessions = filterDate
    ? sessions.filter(
        (session) => session.date === format(filterDate, "yyyy-MM-dd")
      )
    : [];

  const groupedSessions = selectedDateSessions.reduce<
    Record<string, DailySession[]>
  >((acc, session) => {
    if (!acc[session.startTime]) {
      acc[session.startTime] = [];
    }
    acc[session.startTime].push(session);
    return acc;
  }, {});

  const timesSlots = Object.keys(groupedSessions).sort();

  const groupedByDate = sessions.reduce<Record<string, DailySession[]>>(
    (acc, session) => {
      if (!acc[session.date]) {
        acc[session.date] = [];
      }
      acc[session.date].push(session);
      return acc;
    },
    {}
  );

  const sortedDates = Object.keys(groupedByDate).sort();

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <Card className="md:w-1/2">
        <CardHeader>
          <CardTitle>Curriculum Calendar</CardTitle>
          <CardDescription>
            View scheduled sessions for {format(currentMonth, "MMMM yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-[400px] w-full" />
            </div>
          ) : (
            <Calendar
              mode="single"
              selected={filterDate || undefined}
              onSelect={setFilterDate}
              month={currentMonth}
              modifiers={{
                hasSession: (date) =>
                  hasSessionsOnDay(date) && isSameMonth(date, currentMonth),
                hasOverdue: (date) =>
                  hasOverdueSessions(date) && isSameMonth(date, currentMonth),
              }}
              modifiersStyles={{
                hasSession: { backgroundColor: "rgba(var(--primary), 0.15)" },
                hasOverdue: {
                  backgroundColor: "rgba(var(--destructive), 0.15)",
                },
              }}
              className="rounded-md border"
            />
          )}
        </CardContent>
      </Card>

      <Card className="md:w-1/2">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>
                {viewMode === "day"
                  ? filterDate
                    ? format(filterDate, "PPPP")
                    : "Selected Date"
                  : "Full Schedule"}
              </CardTitle>
              <CardDescription>
                {viewMode === "day"
                  ? `${selectedDateSessions.length} session${
                      selectedDateSessions.length !== 1 ? "s" : ""
                    } scheduled`
                  : `${sessions.length} total sessions`}
              </CardDescription>
            </div>
            <Tabs
              defaultValue="day"
              onValueChange={(v) => setViewMode(v as "day" | "schedule")}
            >
              <TabsList>
                <TabsTrigger value="day">Day View</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <div className="h-[350px] overflow-y-auto pr-2">
              {viewMode === "day" ? (
                <>
                  {timesSlots.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {filterDate
                        ? "No sessions scheduled for this date"
                        : "Select a date to view sessions"}
                    </div>
                  ) : (
                    <>
                      {timesSlots.map((timeSlot) => (
                        <div key={timeSlot} className="mb-4">
                          <h3 className="font-medium text-sm text-muted-foreground mb-2">
                            {timeSlot}
                          </h3>
                          {groupedSessions[timeSlot].map((session) => (
                            <Card key={session.id} className="mb-2">
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <CardTitle className="text-lg">
                                      {session.topicName}
                                    </CardTitle>
                                    <CardDescription>
                                      {session.startTime} - {session.endTime}
                                    </CardDescription>
                                  </div>
                                  <CurriculumStatusBadge
                                    status={session.status}
                                  />
                                </div>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <div className="text-sm text-muted-foreground">
                                  <p>Section: {session.sectionName}</p>
                                  <p>Subject: {session.subjectName}</p>
                                  {session.completionPercentage !==
                                    undefined && (
                                    <div className="mt-1">
                                      <div className="bg-muted h-2 rounded-full w-full">
                                        <div
                                          className="bg-primary h-2 rounded-full"
                                          style={{
                                            width: `${session.completionPercentage}%`,
                                          }}
                                        />
                                      </div>
                                      <span className="text-xs">
                                        {session.completionPercentage}%
                                        completed
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ))}
                    </>
                  )}
                </>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Topic</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedDates.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          No sessions found in the selected month
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedDates.map((date) =>
                        groupedByDate[date].map((session, idx) => (
                          <TableRow
                            key={`${date}-${idx}`}
                            className="cursor-pointer hover:bg-muted/60"
                            onClick={() => setFilterDate(parseISO(date))}
                          >
                            <TableCell>
                              {idx === 0
                                ? format(parseISO(date), "MMM d, yyyy")
                                : ""}
                            </TableCell>
                            <TableCell>{`${session.startTime} - ${session.endTime}`}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {session.topicName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {session.subjectName}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <CurriculumStatusBadge status={session.status} />
                            </TableCell>
                          </TableRow>
                        ))
                      )
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CurriculumSessionsCalendar;

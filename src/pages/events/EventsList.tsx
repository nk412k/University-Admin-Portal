import React, { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { useEvents } from "@/hooks/useEvents";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Calendar,
  Clock,
  MapPin,
  CheckSquare,
  PlusCircle,
  Search,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EventChecklist } from "@/components/events/EventChecklist";
import { EventForm } from "@/components/events/EventForm";
import { Event } from "@/types";
import { Input } from "@/components/ui/input";

const PAGE_SIZE = 10;

const EventsList: React.FC = () => {
  const {
    events: contextEvents,
    employees,
    universities,
    sections,
    isLoading: isDataLoading,
  } = useData();
  const {
    events: fetchedEvents,
    isLoading: isEventsLoading,
    refetchEvents,
  } = useEvents();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedEventName, setSelectedEventName] = useState<string>("");
  const [showEventForm, setShowEventForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isLoading = isDataLoading || isEventsLoading;

  const combinedEvents = [...fetchedEvents];
  if (contextEvents) {
    contextEvents.forEach((contextEvent) => {
      const eventExists = combinedEvents.some(
        (e) =>
          e.id === contextEvent.id ||
          e.event_id === contextEvent.id ||
          e.event_id === contextEvent.event_id ||
          e.id === contextEvent.event_id
      );
      if (!eventExists) {
        combinedEvents.push(contextEvent);
      }
    });
  }

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  const handleEventCreated = (newEvent: Event) => {
    refetchEvents();
  };

  const sortedEvents = [...combinedEvents].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
    const dateB = b.created_at ? new Date(b.created_at) : new Date(0);

    return dateB.getTime() - dateA.getTime();
  });

  const filteredEvents = sortedEvents.filter((event) => {
    const eventTitle = (event.title || event.name || "").toLowerCase();
    return eventTitle.includes(searchQuery.toLowerCase());
  });

  const totalPages = Math.ceil(filteredEvents.length / PAGE_SIZE);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const getUniversityName = (universityId: string) => {
    const university = universities.find(
      (u) => u.id === universityId || u.university_id === universityId
    );
    return university ? university.name : "Unknown";
  };

  const getSectionName = (sectionId: string | null) => {
    if (!sectionId) return "All Sections";
    const section = sections.find(
      (s) => s.id === sectionId || s.section_id === sectionId
    );
    return section ? section.name : "Unknown";
  };

  const getEmployeeName = (employeeId: string | null) => {
    if (!employeeId) return "Not Assigned";
    const employee = employees.find(
      (e) => e.id === employeeId || e.employee_id === employeeId
    );
    return employee ? employee.full_name : "Unknown";
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
      case "planned":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
      case "ongoing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleChecklistClick = (eventId: string, eventName: string) => {
    setSelectedEventId(eventId);
    setSelectedEventName(eventName);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">
            Schedule and manage all educational events
          </p>
        </div>
        <Button onClick={() => setShowEventForm(true)}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      <div className="relative">
        <div className="flex w-full max-w-sm items-center space-x-2 mb-4">
          <Search className="h-4 w-4 absolute left-3 text-gray-500" />
          <Input
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search events by title..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>
            Events sorted by newest first ({filteredEvents.length})
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Point of Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Checklist</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEvents.map((event) => {
              const startDate = new Date(
                event.start_time || event.start_datetime
              );
              const endDate =
                event.end_time || event.end_datetime
                  ? new Date(event.end_time || event.end_datetime)
                  : null;

              return (
                <TableRow key={event.id || event.event_id}>
                  <TableCell className="font-medium">
                    <div>
                      {event.title || event.name}
                      <p className="text-xs text-muted-foreground">
                        {getUniversityName(event.university_id)} -{" "}
                        {getSectionName(event.section_id)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className="text-sm">
                          {format(startDate, "MMM d, yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span className="text-sm">
                          {format(startDate, "h:mm a")}
                          {endDate && ` - ${format(endDate, "h:mm a")}`}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {event.location || event.venue ? (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location || event.venue}</span>
                      </div>
                    ) : (
                      "Not specified"
                    )}
                  </TableCell>
                  <TableCell>
                    {getEmployeeName(event.poc_employee_id || event.poc)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClass(
                        event.status
                      )}`}
                    >
                      {event.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleChecklistClick(
                          event.id || event.event_id,
                          event.title || event.name
                        )
                      }
                      className="flex items-center gap-1"
                    >
                      <CheckSquare className="h-4 w-4" />
                      <span>View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {paginatedEvents.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {searchQuery
                    ? "No events match your search."
                    : "No events found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
          {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
            const pageNumber = i + 1;
            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  isActive={pageNumber === currentPage}
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          {totalPages > 5 && (
            <>
              <PaginationItem>
                <span className="flex h-9 w-9 items-center justify-center">
                  ...
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <Dialog
        open={!!selectedEventId}
        onOpenChange={() => setSelectedEventId(null)}
      >
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedEventName}</DialogTitle>
            <DialogDescription>
              View and manage the checklist for this event
            </DialogDescription>
          </DialogHeader>
          {selectedEventId && <EventChecklist eventId={selectedEventId} />}
        </DialogContent>
      </Dialog>

      <EventForm
        open={showEventForm}
        onOpenChange={setShowEventForm}
        onSuccess={handleEventCreated}
      />
    </div>
  );
};

export default EventsList;

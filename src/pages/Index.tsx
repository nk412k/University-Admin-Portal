import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  PlusCircle,
  Sparkles,
  LayoutDashboard,
  GraduationCap,
  Users,
  FileBarChart,
  Bell,
  ArrowRight,
  ArrowUpRight,
  BarChart,
} from "lucide-react";
import { format } from "date-fns";
import { useEvents } from "@/hooks/useEvents";
import { useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const { events, isLoading } = useEvents();
  const { universities, students, sections } = useData();
  const navigate = useNavigate();

  const now = new Date();
  const threeDaysLater = new Date(now);
  threeDaysLater.setDate(now.getDate() + 3);

  const upcomingEvents = events
    .filter((event) => {
      const eventDate = new Date(event.start_datetime || event.start_time);
      return eventDate >= now && eventDate <= threeDaysLater;
    })
    .sort((a, b) => {
      const dateA = new Date(a.start_datetime || a.start_time);
      const dateB = new Date(b.start_datetime || b.start_time);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 5);

  const getUniversityName = (universityId: string) => {
    const university = universities.find(
      (u) => u.id === universityId || u.university_id === universityId
    );
    return university ? university.name : "Unknown";
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
      case "planned":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200";
      case "in_progress":
      case "ongoing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const quickStats = [
    {
      title: "Students",
      value: students.length,
      icon: <GraduationCap className="h-5 w-5 text-primary" />,
      change: "+12%",
      color: "text-primary",
    },
    {
      title: "Sections",
      value: sections.length,
      icon: <Users className="h-5 w-5 text-purple-500" />,
      change: "+3",
      color: "text-purple-500",
    },
    {
      title: "Events",
      value: upcomingEvents.length,
      icon: <Calendar className="h-5 w-5 text-blue-500" />,
      change: "This week",
      color: "text-blue-500",
    },
    {
      title: "Attendance",
      value: "87%",
      icon: <BarChart className="h-5 w-5 text-green-500" />,
      change: "+2%",
      color: "text-green-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative rounded-xl glass p-6 overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 dark:from-primary/5 dark:to-purple-500/5"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Welcome to University Admin Portal
              </h1>
              <p className="text-muted-foreground max-w-md mt-2">
                Manage your educational institution with powerful tools and
                insights for administrators
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="default" onClick={() => navigate("/dashboard")}>
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/events/create")}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat, i) => (
          <Card key={i} className="glass">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className="p-2 rounded-full bg-muted">{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center">
                <Badge variant="secondary" className="text-xs mr-1">
                  {stat.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="glass h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  Upcoming Events
                </CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate("/events")}
                  className="gap-1"
                >
                  View All
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
              <CardDescription>
                Events scheduled in the next 3 days
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
                </div>
              ) : upcomingEvents.length > 0 ? (
                <div className="divide-y">
                  {upcomingEvents.map((event) => {
                    const startDate = new Date(
                      event.start_time || event.start_datetime
                    );

                    return (
                      <div
                        key={event.id || event.event_id}
                        className="flex items-start space-x-4 p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 flex flex-col items-center justify-center bg-primary/10 rounded-xl border border-primary/20">
                            <span className="text-xs font-medium text-primary">
                              {format(startDate, "MMM")}
                            </span>
                            <span className="text-xl font-bold">
                              {format(startDate, "dd")}
                            </span>
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">
                              {event.title || event.name}
                            </h3>
                            <Badge
                              className={`${getStatusBadgeClass(event.status)}`}
                            >
                              {event.status}
                            </Badge>
                          </div>

                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 text-primary" />
                              <span>{format(startDate, "h:mm a")}</span>
                            </div>

                            {(event.location || event.venue) && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3 text-primary" />
                                <span>{event.location || event.venue}</span>
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {getUniversityName(event.university_id)}
                          </div>
                        </div>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="flex-shrink-0"
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No upcoming events in the next 3 days
                  </p>
                  <Button onClick={() => navigate("/events")} size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Event
                  </Button>
                </div>
              )}
            </CardContent>
            {upcomingEvents.length > 0 && (
              <CardFooter className="bg-muted/50 p-3">
                <Button
                  onClick={() => navigate("/events/create")}
                  className="gap-1 w-full"
                >
                  <PlusCircle className="h-4 w-4" />
                  Create New Event
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>

        <div>
          <Card className="glass h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common tasks you might want to perform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start group hover:border-primary"
                onClick={() => navigate("/events")}
              >
                <Calendar className="mr-3 h-5 w-5 text-primary group-hover:text-primary" />
                <div className="flex flex-col items-start">
                  <span>Manage Events</span>
                  <span className="text-xs text-muted-foreground">
                    Schedule and organize activities
                  </span>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start group hover:border-purple-500"
                onClick={() => navigate("/students/list")}
              >
                <GraduationCap className="mr-3 h-5 w-5 text-purple-500 group-hover:text-purple-500" />
                <div className="flex flex-col items-start">
                  <span>View Students</span>
                  <span className="text-xs text-muted-foreground">
                    Manage student profiles and data
                  </span>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start group hover:border-blue-500"
                onClick={() => navigate("/employees")}
              >
                <Users className="mr-3 h-5 w-5 text-blue-500 group-hover:text-blue-500" />
                <div className="flex flex-col items-start">
                  <span>Manage Staff</span>
                  <span className="text-xs text-muted-foreground">
                    Staff directory and administration
                  </span>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start group hover:border-green-500"
                onClick={() => navigate("/reports")}
              >
                <FileBarChart className="mr-3 h-5 w-5 text-green-500 group-hover:text-green-500" />
                <div className="flex flex-col items-start">
                  <span>Generate Reports</span>
                  <span className="text-xs text-muted-foreground">
                    Create insights and analytics
                  </span>
                </div>
              </Button>
            </CardContent>
            <CardFooter className="bg-muted/50 flex justify-center p-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="gap-1"
              >
                Go to Dashboard
                <ArrowRight className="h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { useEvents } from "@/hooks/useEvents";
import { useHolidays } from "@/hooks/useHolidays";
import { format, isAfter, isBefore, parseISO } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowUpRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock,
  Database,
  GraduationCap,
  LayoutDashboard,
  MoreHorizontal,
  Settings,
  ShieldAlert,
  TrendingUp,
  User2,
  UserRound,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const { students, sections } = useData();
  const { events } = useEvents();
  const [activeTab, setActiveTab] = useState("overview");

  const performanceData = [
    { name: "Week 1", academic: 75, attendance: 82 },
    { name: "Week 2", academic: 78, attendance: 85 },
    { name: "Week 3", academic: 80, attendance: 83 },
    { name: "Week 4", academic: 84, attendance: 86 },
    { name: "Week 5", academic: 82, attendance: 82 },
    { name: "Week 6", academic: 86, attendance: 87 },
    { name: "Week 7", academic: 88, attendance: 90 },
  ];

  const gradeData = [
    { name: "A", value: 25, color: "#8b5cf6" },
    { name: "B", value: 40, color: "#3b82f6" },
    { name: "C", value: 20, color: "#facc15" },
    { name: "D", value: 10, color: "#f97316" },
    { name: "F", value: 5, color: "#ef4444" },
  ];

  const activities = [
    {
      id: 1,
      title: "New student registered",
      description: "John Smith registered in Computer Science section",
      time: "10 minutes ago",
      icon: (
        <UserRound className="h-8 w-8 text-purple-500 bg-purple-100 p-1.5 rounded-full" />
      ),
    },
    {
      id: 2,
      title: "Attendance alert",
      description: "Section CS-B attendance below 70% today",
      time: "35 minutes ago",
      icon: (
        <ShieldAlert className="h-8 w-8 text-amber-500 bg-amber-100 p-1.5 rounded-full" />
      ),
    },
    {
      id: 3,
      title: "Event scheduled",
      description: "Science exhibition scheduled for next week",
      time: "2 hours ago",
      icon: (
        <CalendarDays className="h-8 w-8 text-blue-500 bg-blue-100 p-1.5 rounded-full" />
      ),
    },
    {
      id: 4,
      title: "Exam results published",
      description: "Mid-term exam results now available",
      time: "Yesterday",
      icon: (
        <CheckCircle2 className="h-8 w-8 text-green-500 bg-green-100 p-1.5 rounded-full" />
      ),
    },
  ];

  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const upcomingEvents = events
    .filter((event) => {
      const eventDate = parseISO(
        event.start_datetime || event.start_time || ""
      );
      return isAfter(eventDate, today) && isBefore(eventDate, nextWeek);
    })
    .sort((a, b) => {
      const dateA = new Date(a.start_datetime || a.start_time || "");
      const dateB = new Date(b.start_datetime || b.start_time || "");
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="glass rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-br from-violet-600 to-primary bg-clip-text text-transparent mb-2">
              Dashboard
            </h1>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={profile?.avatar_url}
                  alt={profile?.full_name}
                />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {profile?.full_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <p className="text-muted-foreground">
                Welcome back,{" "}
                <span className="font-medium text-foreground">
                  {profile?.full_name || "User"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-[300px]"
            >
              <TabsList className="grid w-full grid-cols-3 bg-background/50 backdrop-blur-sm">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Analytics
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Activity
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button
              size="icon"
              variant="outline"
              className="bg-background/50 backdrop-blur-sm"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{students.length}</div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center">
              <Badge className="bg-green-500 text-white text-xs mr-1">
                +8%
              </Badge>
              from last month
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              Attendance Rate
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">82.4%</div>
            <Progress value={82.4} className="h-1 mt-2" />
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              Upcoming Events
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingEvents.length}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Next: {upcomingEvents[0]?.title || "None scheduled"}
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Sections</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{sections.length}</div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center">
              <Badge className="bg-blue-500 text-white text-xs mr-1">
                Active
              </Badge>
              across {students.length} students
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Performance Trends</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View detailed report</DropdownMenuItem>
                    <DropdownMenuItem>Download data</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Share</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>
                Academic performance and attendance trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={performanceData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorAcademic"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8b5cf6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorAttendance"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="academic"
                      stroke="#8b5cf6"
                      fillOpacity={1}
                      fill="url(#colorAcademic)"
                    />
                    <Area
                      type="monotone"
                      dataKey="attendance"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorAttendance)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>Student performance by grades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={gradeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {gradeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Percentage"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center mt-2 space-x-6">
                  {gradeData.map((entry) => (
                    <div
                      key={entry.name}
                      className="flex items-center space-x-2"
                    >
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <span className="text-sm text-muted-foreground">
                        {entry.name} ({entry.value}%)
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Students At Risk</CardTitle>
                <CardDescription>Students needing attention</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[230px]">
                  <div className="p-4 space-y-4">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {`S${index}`}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              Student {index}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ID: S{100 + index}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div>
                            <p className="text-xs text-muted-foreground text-right">
                              Attendance
                            </p>
                            <p className="text-sm font-medium text-red-500">
                              {55 - index * 5}%
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="md:col-span-3 space-y-6">
          <Card className="border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="px-6 space-y-3 divide-y">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <div key={event.event_id} className="py-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {event.description}
                          </p>
                        </div>
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                          {format(
                            parseISO(
                              event.start_datetime || event.start_time || ""
                            ),
                            "MMM d"
                          )}
                        </Badge>
                      </div>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {format(
                          parseISO(
                            event.start_datetime || event.start_time || ""
                          ),
                          "h:mm a"
                        )}
                        {event.location && (
                          <>
                            <span className="mx-1">•</span>
                            {event.location}
                          </>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-muted-foreground">
                    No upcoming events
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-3">
              <Button variant="outline" className="w-full">
                View All Events
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="px-6 space-y-0">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="py-4 flex gap-4 border-b last:border-0"
                    >
                      <div className="flex-shrink-0 mt-1">{activity.icon}</div>
                      <div>
                        <h4 className="font-medium">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="border-t px-6 py-3">
              <Button variant="outline" className="w-full">
                View Activity Log
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

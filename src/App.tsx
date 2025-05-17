import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { UniversityProvider } from "./contexts/UniversityContext";
import { UIProvider } from "./contexts/UIContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Toaster } from "@/components/ui/toaster";

// Layouts
import MainLayout from "./components/layout/MainLayout";
import AuthLayout from "./components/layout/AuthLayout";

// Auth Pages
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";

// Main Pages
import Dashboard from "./pages/Dashboard";
import UniversitiesList from "./pages/universities/UniversitiesList";
import StudentList from "./pages/students/StudentList";
import StudentFees from "./pages/students/StudentFees";
import StudentRisk from "./pages/students/StudentRisk";
import EmployeesList from "./pages/employees/EmployeesList";
import TeachingHours from "./pages/teaching/TeachingHours";
import EventsList from "./pages/events/EventsList";
import FeedbackList from "./pages/feedback/FeedbackList";
import AlertsPage from "./pages/alerts/AlertsPage";
import ReportsList from "./pages/reports/ReportsList";
import NotFound from "./pages/NotFound";
import { AnnouncementsList } from "./pages";

// Curriculum Pages
import CurriculumSessions from "./pages/curriculum/CurriculumSessions";
import CurriculumTopics from "./pages/curriculum/CurriculumTopics";
import CurriculumOverview from "./pages/curriculum/CurriculumOverview";

function App() {
  return (
    <AuthProvider>
      <UniversityProvider>
        <DataProvider>
          <UIProvider>
            <ThemeProvider>
              <Routes>
                {/* Auth Routes */}
                <Route element={<AuthLayout />}>
                  <Route path="/auth/signin" element={<SignIn />} />
                  <Route path="/auth/signup" element={<SignUp />} />
                </Route>

                {/* Main Routes */}
                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/universities" element={<UniversitiesList />} />

                  {/* Curriculum Routes */}
                  <Route
                    path="/curriculum/daily-schedule"
                    element={<CurriculumSessions />}
                  />
                  <Route
                    path="/curriculum/topics"
                    element={<CurriculumTopics />}
                  />
                  <Route
                    path="/curriculum/section-wise-progress"
                    element={<CurriculumOverview />}
                  />
                  <Route path="/students/list" element={<StudentList />} />
                  <Route path="/students/fees" element={<StudentFees />} />
                  <Route path="/students/risk" element={<StudentRisk />} />
                  <Route path="/employees" element={<EmployeesList />} />
                  <Route path="/teaching-hours" element={<TeachingHours />} />
                  <Route path="/events" element={<EventsList />} />
                  <Route path="/feedback" element={<FeedbackList />} />
                  <Route path="/alerts" element={<AlertsPage />} />
                  <Route path="/reports" element={<ReportsList />} />
                  <Route
                    path="/announcements"
                    element={<AnnouncementsList />}
                  />
                </Route>

                {/* Default route */}
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />

                {/* Redirect from old attendance page to student list */}
                <Route
                  path="/students/attendance"
                  element={<Navigate to="/students/list" replace />}
                />

                {/* Redirect from grades page to student list */}
                <Route
                  path="/students/grades"
                  element={<Navigate to="/students/list" replace />}
                />

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>

              {/* Toast notifications */}
              <Toaster />
            </ThemeProvider>
          </UIProvider>
        </DataProvider>
      </UniversityProvider>
    </AuthProvider>
  );
}

export default App;

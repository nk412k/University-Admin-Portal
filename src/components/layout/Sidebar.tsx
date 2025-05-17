import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUI } from "@/contexts/UIContext";
import { usePermissions } from "@/hooks/usePermissions";
import {
  BarChart3,
  Building,
  Calendar,
  ChevronDown,
  GraduationCap,
  Home,
  Users,
  FileText,
  Clock,
  MessageSquare,
  Bell,
  BookOpen,
  Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
  isChild?: boolean;
  collapsed?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  href,
  isActive = false,
  isChild = false,
  collapsed = false,
}) => {
  const content = (
    <Link
      to={href}
      className={cn(
        "nav-link flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-300 ease-in-out",
        isActive
          ? "active bg-accent/70 text-primary font-medium"
          : "text-muted-foreground hover:bg-accent/40 hover:text-foreground",
        isChild && "ml-5 pl-4",
        collapsed && !isChild && "justify-center p-2"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 rounded-md p-1.5",
          isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground"
        )}
      >
        {icon}
      </div>
      {!collapsed && <span className="whitespace-nowrap">{label}</span>}
    </Link>
  );

  if (collapsed && !isChild) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="glass">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
};

interface NavGroupProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  collapsed?: boolean;
}

const NavGroup: React.FC<NavGroupProps> = ({
  icon,
  label,
  children,
  defaultOpen = false,
  collapsed = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (collapsed) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              className={cn(
                "flex w-full items-center justify-center rounded-lg p-2 text-sm text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground my-1"
              )}
            >
              <div className="flex-shrink-0 rounded-md bg-muted p-1.5">
                {icon}
              </div>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="glass">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full mb-1">
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground",
            isOpen && "bg-accent/30 text-foreground"
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex-shrink-0 rounded-md p-1.5",
                isOpen
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {icon}
            </div>
            {label}
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 pt-1 transition-all duration-300 ease-in-out">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { profile } = useAuth();
  const { sidebarExpanded, toggleSidebar } = useUI();
  const { permissions, isLoading: permissionsLoading } = usePermissions();

  const isActive = (path: string) => location.pathname === path;

  const isAdmin = profile?.role === "college_admin";
  if (permissionsLoading) {
    return (
      <aside
        className={cn(
          "sidebar fixed bottom-0 left-0 top-16 z-20 border-r transition-all duration-300 ease-in-out md:block",
          sidebarExpanded ? "w-64" : "w-16"
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto p-3">
          <div className="flex items-center justify-center h-full">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "sidebar fixed bottom-0 left-0 top-16 z-20 border-r transition-all duration-300 ease-in-out md:block",
        sidebarExpanded ? "w-64" : "w-16"
      )}
    >
      <div className="flex h-full flex-col overflow-y-auto py-4 px-3">
        <nav className="grid gap-1">
          <NavItem
            icon={<Home className="h-4 w-4" />}
            label="Dashboard"
            href="/dashboard"
            isActive={isActive("/dashboard")}
            collapsed={!sidebarExpanded}
          />

          {profile?.role === "central_admin" && (
            <NavItem
              icon={<Building className="h-4 w-4" />}
              label="Universities"
              href="/universities"
              isActive={isActive("/universities")}
              collapsed={!sidebarExpanded}
            />
          )}

          {(isAdmin || permissions?.curriculum) && (
            <NavGroup
              icon={<BookOpen className="h-4 w-4" />}
              label="Curriculum"
              defaultOpen={location.pathname.includes("/curriculum")}
              collapsed={!sidebarExpanded}
            >
              <NavItem
                icon={<FileText className="h-4 w-4" />}
                label="Daily Schedule"
                href="/curriculum/daily-schedule"
                isActive={isActive("/curriculum/daily-schedule")}
                isChild
                collapsed={!sidebarExpanded}
              />
              <NavItem
                icon={<FileText className="h-4 w-4" />}
                label="Topics Progress"
                href="/curriculum/topics"
                isActive={isActive("/curriculum/topics")}
                isChild
                collapsed={!sidebarExpanded}
              />
              <NavItem
                icon={<FileText className="h-4 w-4" />}
                label="Section Overview"
                href="/curriculum/section-wise-progress"
                isActive={isActive("/curriculum/section-wise-progress")}
                isChild
                collapsed={!sidebarExpanded}
              />
            </NavGroup>
          )}

          {(isAdmin || permissions?.students) && (
            <NavGroup
              icon={<GraduationCap className="h-4 w-4" />}
              label="Students"
              defaultOpen={location.pathname.includes("/students")}
              collapsed={!sidebarExpanded}
            >
              <NavItem
                icon={<Users className="h-4 w-4" />}
                label="Student List"
                href="/students/list"
                isActive={isActive("/students/list")}
                isChild
                collapsed={!sidebarExpanded}
              />
              <NavItem
                icon={<Users className="h-4 w-4" />}
                label="Student Fees"
                href="/students/fees"
                isActive={isActive("/students/fees")}
                isChild
                collapsed={!sidebarExpanded}
              />
              <NavItem
                icon={<Users className="h-4 w-4" />}
                label="Risk Assessment"
                href="/students/risk"
                isActive={isActive("/students/risk")}
                isChild
                collapsed={!sidebarExpanded}
              />
            </NavGroup>
          )}

          {(isAdmin || permissions?.employees) && (
            <NavItem
              icon={<Users className="h-4 w-4" />}
              label="Employees"
              href="/employees"
              isActive={isActive("/employees")}
              collapsed={!sidebarExpanded}
            />
          )}

          {(isAdmin || permissions?.teaching_hours) && (
            <NavItem
              icon={<Clock className="h-4 w-4" />}
              label="Teaching Hours"
              href="/teaching-hours"
              isActive={isActive("/teaching-hours")}
              collapsed={!sidebarExpanded}
            />
          )}

          {(isAdmin || permissions?.events) && (
            <NavItem
              icon={<Calendar className="h-4 w-4" />}
              label="Events"
              href="/events"
              isActive={isActive("/events")}
              collapsed={!sidebarExpanded}
            />
          )}

          {(isAdmin || permissions?.feedback) && (
            <NavItem
              icon={<MessageSquare className="h-4 w-4" />}
              label="Feedback"
              href="/feedback"
              isActive={isActive("/feedback")}
              collapsed={!sidebarExpanded}
            />
          )}

          {(isAdmin || permissions?.alerts) && (
            <NavItem
              icon={<Bell className="h-4 w-4" />}
              label="Alerts"
              href="/alerts"
              isActive={isActive("/alerts")}
              collapsed={!sidebarExpanded}
            />
          )}

          {(isAdmin || permissions?.reports) && (
            <NavItem
              icon={<BarChart3 className="h-4 w-4" />}
              label="Reports"
              href="/reports"
              isActive={isActive("/reports")}
              collapsed={!sidebarExpanded}
            />
          )}

          {(isAdmin || permissions?.announcements) && (
            <NavItem
              icon={<Megaphone className="h-4 w-4" />}
              label="Announcements"
              href="/announcements"
              isActive={isActive("/announcements")}
              collapsed={!sidebarExpanded}
            />
          )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

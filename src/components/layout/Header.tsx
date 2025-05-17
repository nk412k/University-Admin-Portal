import React from "react";
import { Bell, Menu, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUniversity } from "@/contexts/UniversityContext";
import { useUI } from "@/contexts/UIContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { University } from "@/types";
import { Input } from "@/components/ui/input";

interface UserProfileProps {
  fullName: string;
  email: string;
  role: string;
  onSignOut: () => void;
}

interface UniversitySelectorProps {
  activeUniversityId: string;
  universities: University[];
  onChange: (universityId: string) => void;
}

const SidebarToggle = ({ onClick }: { onClick: () => void }) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={onClick}
    className="mr-2"
    aria-label="Toggle sidebar"
  >
    <Menu className="h-5 w-5" />
  </Button>
);

const SearchBar = () => (
  <div className="relative max-w-md hidden md:flex items-center">
    <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
    <Input
      type="search"
      placeholder="Search..."
      className="pl-8 w-[200px] md:w-[300px] rounded-full bg-background"
    />
  </div>
);

const UniversitySelector: React.FC<UniversitySelectorProps> = ({
  activeUniversityId,
  universities,
  onChange,
}) => (
  <Select value={activeUniversityId} onValueChange={onChange}>
    <SelectTrigger className="w-[200px] rounded-full">
      <SelectValue placeholder="Select University" />
    </SelectTrigger>
    <SelectContent>
      {universities.map((uni) => (
        <SelectItem key={uni.university_id} value={uni.university_id}>
          {uni.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

const UserProfile: React.FC<UserProfileProps> = ({
  fullName,
  email,
  role,
  onSignOut,
}) => {
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full p-0 overflow-hidden"
          aria-label="User menu"
        >
          <Avatar className="h-9 w-9 ring-2 ring-primary/20">
            <AvatarImage src="/avatar-placeholder.png" alt={fullName} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{fullName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{email}</p>
            <p className="text-xs uppercase text-muted-foreground">{role}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut} className="cursor-pointer">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const NotificationsButton = () => (
  <Button
    variant="ghost"
    size="icon"
    aria-label="Notifications"
    className="relative"
  >
    <Bell className="h-5 w-5" />
    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
      3
    </span>
  </Button>
);

const Header: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const {
    activeUniversity,
    setActiveUniversity,
    availableUniversities,
    isLoading,
  } = useUniversity();
  const { toggleSidebar } = useUI();

  const handleUniversityChange = (universityId: string) => {
    const selected = availableUniversities.find(
      (u) => u.university_id === universityId
    );
    if (selected) {
      setActiveUniversity(selected);
    }
  };

  // Check if the user role has permission to switch universities
  const canSwitchUniversity =
    profile?.role === "central_admin" || profile?.role === "college_admin";

  const shouldShowUniversitySelector =
    !isLoading && availableUniversities.length > 0 && canSwitchUniversity;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="flex items-center gap-3">
        <SidebarToggle onClick={toggleSidebar} />
        <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          EduAdmin Portal
        </h2>
      </div>

      <SearchBar />

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <NotificationsButton />

        {shouldShowUniversitySelector && (
          <UniversitySelector
            activeUniversityId={activeUniversity?.university_id || ""}
            universities={availableUniversities}
            onChange={handleUniversityChange}
          />
        )}

        {profile && (
          <UserProfile
            fullName={profile.full_name}
            email={user?.email || ""}
            role={profile.role}
            onSignOut={signOut}
          />
        )}
      </div>
    </header>
  );
};

export default Header;

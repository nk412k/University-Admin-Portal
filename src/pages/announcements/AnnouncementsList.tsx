import React, { useState } from "react";
import { format } from "date-fns";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Search, EyeOff, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnnouncementForm from "@/components/announcements/AnnouncementForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format as formatDate } from "date-fns";
import { Calendar } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PAGE_SIZE = 10;

const AnnouncementDetailContent = ({
  announcementId,
  onClose,
}: {
  announcementId: string;
  onClose?: () => void;
}) => {
  const { announcements } = useAnnouncements();
  const [isLoading, setIsLoading] = useState(true);

  const announcement = React.useMemo(() => {
    return announcements.find((a) => a.announcement_id === announcementId);
  }, [announcementId, announcements]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [announcementId]);

  if (isLoading || !announcement) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Loading announcement details...</p>
      </div>
    );
  }

  const formatDetailDate = (dateString: string) => {
    return formatDate(new Date(dateString), "PPP");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">{announcement.title}</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge
            variant="outline"
            className="flex items-center gap-1 px-2 py-1"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDetailDate(announcement.publish_from)}</span>
          </Badge>
          {announcement.publish_until && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 px-2 py-1"
            >
              <span>Until {formatDetailDate(announcement.publish_until)}</span>
            </Badge>
          )}
          <Badge
            variant={announcement.is_active ? "success" : "destructive"}
            className={`flex items-center gap-1 px-2 py-1 ${
              announcement.is_active
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {announcement.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="prose max-w-none dark:prose-invert">
          <p className="whitespace-pre-wrap">{announcement.content}</p>
        </div>
      </div>
    </div>
  );
};

const AnnouncementsList: React.FC = () => {
  const {
    announcements,
    isLoading,
    markAnnouncementAsRead,
    toggleAnnouncementActive,
  } = useAnnouncements();
  const { profile } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<
    string | null
  >(null);
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const isAdmin =
    profile?.role === "college_admin" || profile?.role === "mentor";

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "unread")
      return matchesSearch && !announcement.read_status;
    if (activeTab === "read") return matchesSearch && announcement.read_status;

    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredAnnouncements.length / PAGE_SIZE);
  const paginatedAnnouncements = filteredAnnouncements.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleAnnouncementClick = (announcementId: string) => {
    setSelectedAnnouncement(announcementId);
    markAnnouncementAsRead(announcementId);
    setDetailsDialogOpen(true);
  };

  const handleToggleActive = (
    announcementId: string,
    currentStatus: boolean
  ) => {
    toggleAnnouncementActive(announcementId, !currentStatus);
  };

  const formatTableDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
            <p className="text-muted-foreground">
              Stay up to date with important announcements
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Announcement
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-auto max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search announcements..."
              className="pl-8 w-full sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value as "all" | "unread" | "read");
              setCurrentPage(1);
            }}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableCaption>
              A list of announcements{" "}
              {activeTab !== "all" ? `(${activeTab})` : ""}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Title</TableHead>
                <TableHead>Published From</TableHead>
                <TableHead className="hidden sm:table-cell">Until</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                {isAdmin && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAnnouncements.length > 0 ? (
                paginatedAnnouncements.map((announcement) => (
                  <TableRow
                    key={announcement.announcement_id}
                    className={!announcement.read_status ? "bg-muted/30" : ""}
                    onClick={() =>
                      handleAnnouncementClick(announcement.announcement_id)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {!announcement.read_status && (
                          <Badge variant="secondary" className="mr-2">
                            New
                          </Badge>
                        )}
                        {announcement.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatTableDate(announcement.publish_from)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {announcement.publish_until
                        ? formatTableDate(announcement.publish_until)
                        : "No end date"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {announcement.is_active ? (
                        <Badge
                          variant="success"
                          className="bg-green-100 text-green-800"
                        >
                          Active
                        </Badge>
                      ) : (
                        <Badge
                          variant="destructive"
                          className="bg-red-100 text-red-800"
                        >
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        <div
                          className="flex space-x-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleToggleActive(
                                announcement.announcement_id,
                                announcement.is_active
                              )
                            }
                          >
                            {announcement.is_active ? (
                              <>
                                <EyeOff className="mr-1 h-4 w-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Activate
                              </>
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={isAdmin ? 5 : 4}
                    className="text-center py-4"
                  >
                    No announcements found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className="gap-1 pl-2.5"
                  >
                    <PaginationPrevious />
                  </Button>
                </PaginationItem>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  </PaginationItem>
                )
              )}
              {currentPage < totalPages && (
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className="gap-1 pr-2.5"
                  >
                    <PaginationNext />
                  </Button>
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        )}
      </div>

      <Dialog
        open={detailsDialogOpen}
        onOpenChange={(open) => {
          setDetailsDialogOpen(open);
          if (!open) setSelectedAnnouncement(null);
        }}
      >
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Announcement Details</DialogTitle>
          </DialogHeader>
          {selectedAnnouncement && (
            <AnnouncementDetailContent
              announcementId={selectedAnnouncement}
              onClose={() => setDetailsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Announcement</DialogTitle>
          </DialogHeader>
          <AnnouncementForm
            onSuccess={() => {
              setCreateDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg md:hidden"
              onClick={() => setCreateDialogOpen(true)}
            >
              <Plus className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create announcement</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default AnnouncementsList;

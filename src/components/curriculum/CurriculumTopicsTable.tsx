
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, parseISO } from "date-fns";
import { CurriculumTopic } from "@/types/curriculum";
import { Skeleton } from "@/components/ui/skeleton";
import CurriculumStatusBadge from "./CurriculumStatusBadge";

interface CurriculumTopicsTableProps {
  topics: CurriculumTopic[];
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

const CurriculumTopicsTable: React.FC<CurriculumTopicsTableProps> = ({
  topics,
  isLoading,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <>
      <div className="flex flex-col gap-4 mb-4 sm:flex-row">
        <Input
          placeholder="Search topics or subjects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sm:max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:max-w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="behind">Behind Schedule</SelectItem>
            <SelectItem value="ahead">Ahead of Schedule</SelectItem>
            <SelectItem value="on_track">On Track</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Topic Name</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Scheduled Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="text-right">Schedule Variance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-5 w-[180px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[120px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[120px]" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-[100px] ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : topics.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No topics found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              topics.map((topic) => (
                <TableRow key={topic.id}>
                  <TableCell className="font-medium">{topic.name}</TableCell>
                  <TableCell>{topic.subjectName}</TableCell>
                  <TableCell>{topic.sectionName}</TableCell>
                  <TableCell>{format(parseISO(topic.deadline), "MMM dd, yyyy")}</TableCell>
                  <TableCell>
                    <CurriculumStatusBadge status={topic.status} />
                  </TableCell>
                  <TableCell>
                    {topic.completionPercentage !== undefined && (
                      <div className="flex items-center">
                        <div className="bg-muted h-2 rounded-full w-full max-w-24">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${topic.completionPercentage}%` }}
                          />
                        </div>
                        <span className="text-xs ml-2">{topic.completionPercentage}%</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {topic.daysLag === 0 ? (
                      <span className="text-green-600">On Track</span>
                    ) : topic.daysLag < 0 ? (
                      <span className="text-blue-600">{Math.abs(topic.daysLag)} days ahead</span>
                    ) : (
                      <span className="text-red-600">{topic.daysLag} days behind</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default CurriculumTopicsTable;

import React, { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Filter, CheckCircle2, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const FeedbackList: React.FC = () => {
  const { students, universities, isLoading } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  const generateFeedbackCategory = () => {
    const categories = [
      "query",
      "complaint",
      "suggestion",
      "appreciation",
      "general",
    ];
    return categories[Math.floor(Math.random() * categories.length)];
  };

  const generateFeedbackScore = () => {
    return Math.floor(Math.random() * 5) + 1;
  };

  const generateFeedbackStatus = () => {
    return Math.random() > 0.5 ? "resolved" : "unresolved";
  };

  const generateFeedbackComment = (category: string, score: number) => {
    const queryComments = [
      "How do I access the course materials?",
      "When will the next exam schedule be published?",
      "Can you explain how the grading system works?",
      "Where can I find information about internship opportunities?",
      "How do I register for the next semester courses?",
    ];

    const complaintComments = [
      "The classroom facilities need improvement.",
      "Response times from administration are too slow.",
      "The course content needs to be updated.",
      "Limited resources are available for students.",
      "Feedback on assignments takes too long.",
    ];

    const suggestionComments = [
      "Consider offering more practical workshops.",
      "It would be helpful to have recorded lectures available.",
      "Adding more study spaces in the library would be beneficial.",
      "Consider extending lab hours during exam periods.",
      "Weekly office hours with professors would be very helpful.",
    ];

    const appreciationComments = [
      "Very helpful and responsive staff.",
      "The course content was well structured and engaging.",
      "I've learned a lot through this program.",
      "Great resources and facilities available.",
      "The instructor was knowledgeable and supportive.",
    ];

    const generalComments = [
      "Just checking in about my progress.",
      "Thank you for your continued support.",
      "Looking forward to the upcoming semester.",
      "The new campus map is helpful.",
      "I appreciate the efforts to improve student experience.",
    ];

    switch (category) {
      case "query":
        return queryComments[Math.floor(Math.random() * queryComments.length)];
      case "complaint":
        return complaintComments[
          Math.floor(Math.random() * complaintComments.length)
        ];
      case "suggestion":
        return suggestionComments[
          Math.floor(Math.random() * suggestionComments.length)
        ];
      case "appreciation":
        return appreciationComments[
          Math.floor(Math.random() * appreciationComments.length)
        ];
      default:
        return generalComments[
          Math.floor(Math.random() * generalComments.length)
        ];
    }
  };

  const generateFeedbackData = () => {
    const feedbackItems = [];
    const feedbackCount = 12;

    for (let i = 0; i < feedbackCount; i++) {
      const randomStudentIndex = Math.floor(Math.random() * students.length);
      const student = students[randomStudentIndex];

      const category = generateFeedbackCategory();
      const score = generateFeedbackScore();
      const status = generateFeedbackStatus();

      feedbackItems.push({
        id: `fb-${i}`,
        student_id: student.id,
        student_name: student.full_name,
        university_id: student.university_id,
        category,
        score,
        status,
        comment: generateFeedbackComment(category, score),
        timestamp: new Date(
          Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
        ).toISOString(),
      });
    }

    return feedbackItems;
  };

  const feedbackData = generateFeedbackData();

  const getUniversityName = (universityId: string) => {
    const university = universities.find((u) => u.id === universityId);
    return university ? university.name : "Unknown";
  };

  const getScoreStars = (score: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`h-4 w-4 ${
              i < score ? "text-yellow-500" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "query":
        return "bg-blue-100 text-blue-800";
      case "complaint":
        return "bg-red-100 text-red-800";
      case "suggestion":
        return "bg-green-100 text-green-800";
      case "appreciation":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "resolved") {
      return (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-800 flex items-center gap-1"
        >
          <CheckCircle2 className="h-3 w-3" />
          Resolved
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className="bg-amber-100 text-amber-800 flex items-center gap-1"
        >
          <AlertCircle className="h-3 w-3" />
          Unresolved
        </Badge>
      );
    }
  };

  const filteredFeedbackData = feedbackData.filter((feedback) => {
    const categoryMatch = selectedCategory
      ? feedback.category === selectedCategory
      : true;
    const statusMatch = selectedStatus
      ? feedback.status === selectedStatus
      : true;
    return categoryMatch && statusMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
          <p className="text-muted-foreground">
            View and analyze student feedback and suggestion
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-2 rounded-md border px-4 py-2">
              <Filter className="h-4 w-4" />
              <span>Category</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setSelectedCategory(null)}>
                  All categories
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCategory("query")}>
                  Queries
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedCategory("complaint")}
                >
                  Complaints
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedCategory("suggestion")}
                >
                  Suggestions
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedCategory("appreciation")}
                >
                  Appreciation
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedCategory("general")}
                >
                  General
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-2 rounded-md border px-4 py-2">
              <Filter className="h-4 w-4" />
              <span>Status</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setSelectedStatus(null)}>
                  All statuses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("resolved")}>
                  Resolved
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedStatus("unresolved")}
                >
                  Unresolved
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {filteredFeedbackData.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="max-w-[300px]">Comment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFeedbackData.map((feedback) => (
                <TableRow key={feedback.id}>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getCategoryBadgeColor(feedback.category)}
                    >
                      {feedback.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{getScoreStars(feedback.score)}</TableCell>
                  <TableCell className="max-w-[300px]">
                    <p
                      className="text-sm text-muted-foreground truncate"
                      title={feedback.comment}
                    >
                      "{feedback.comment}"
                    </p>
                  </TableCell>
                  <TableCell>
                    {new Date(feedback.timestamp).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(feedback.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
          <div className="text-center">
            <p className="text-muted-foreground">
              No feedback found for the selected filters
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackList;

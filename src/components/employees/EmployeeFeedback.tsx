import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface FeedbackData {
  id: string;
  rating: number;
  feedback_text: string;
  submitted_at: string;
}

interface EmployeeFeedbackProps {
  employeeId: string;
  employeeName: string;
  isOpen: boolean;
  onClose: () => void;
  existingFeedback?: FeedbackData[];
}

const EmployeeFeedback: React.FC<EmployeeFeedbackProps> = ({
  employeeId,
  employeeName,
  isOpen,
  onClose,
  existingFeedback = [],
}) => {
  const { toast } = useToast();
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"view" | "add">("view");

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please provide a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (feedback.trim().length < 10) {
      toast({
        title: "Feedback Required",
        description:
          "Please provide detailed feedback (at least 10 characters).",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("feedback").insert({
        target_id: employeeId,
        target_type: "employee",
        rating,
        feedback_text: feedback,
        category: "general",
      });

      if (error) throw error;

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      });

      setRating(0);
      setFeedback("");
      onClose();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Employee Feedback</DialogTitle>
          <DialogDescription>Feedback for {employeeName}</DialogDescription>
        </DialogHeader>

        <div className="flex justify-center space-x-4 border-b mb-4">
          <Button
            variant={activeTab === "view" ? "default" : "ghost"}
            className="rounded-none border-b-2 border-transparent px-1"
            onClick={() => setActiveTab("view")}
          >
            View Feedback ({existingFeedback.length})
          </Button>
          <Button
            variant={activeTab === "add" ? "default" : "ghost"}
            className="rounded-none border-b-2 border-transparent px-1"
            onClick={() => setActiveTab("add")}
          >
            Add Feedback
          </Button>
        </div>

        {activeTab === "view" ? (
          <div className="max-h-[400px] overflow-y-auto space-y-4">
            {existingFeedback.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No feedback available yet.
              </p>
            ) : (
              existingFeedback.map((item) => (
                <div key={item.id} className="border rounded-md p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < item.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-medium">
                        {item.rating} out of 5
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(item.submitted_at)}
                    </span>
                  </div>
                  <p className="text-sm">{item.feedback_text}</p>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        rating >= star
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating > 0 ? `${rating} out of 5` : "Select rating"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea
                id="feedback"
                placeholder="Please provide your feedback here..."
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        )}

        <DialogFooter>
          {activeTab === "add" && (
            <div className="flex space-x-2 w-full justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          )}

          {activeTab === "view" && (
            <Button type="button" onClick={onClose}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeFeedback;

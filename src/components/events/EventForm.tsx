import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useData } from "@/contexts/DataContext";
import { Event, EventStatus, EventType } from "@/types";

const eventFormSchema = z.object({
  name: z.string().min(3, "Event name must be at least 3 characters"),
  venue: z.string().min(2, "Venue is required"),
  event_type: z.enum([
    "section_specific",
    "university_specific",
    "user_specific",
  ]),
  university_id: z.string().uuid(),
  section_id: z.string().uuid().optional(),
  status: z.enum(["planned", "ongoing", "completed"]).default("planned"),
  start_datetime: z.date(),
  end_datetime: z.date(),
  is_daily_checklist: z.boolean().default(false),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

interface EventFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (event: Event) => void;
}

export function EventForm({ open, onOpenChange, onSuccess }: EventFormProps) {
  const { universities, sections } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const fixedPocId = "1534db45-186a-4d65-980c-4c87d2865a36";

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: "",
      venue: "",
      event_type: "university_specific",
      status: "planned",
      is_daily_checklist: false,
      university_id:
        universities.length > 0
          ? universities[0].university_id || universities[0].id
          : "",
    },
  });

  const eventType = form.watch("event_type");
  const selectedUniversityId = form.watch("university_id");

  const filteredSections = sections.filter(
    (section) => section.university_id === selectedUniversityId
  );

  async function onSubmit(data: EventFormValues) {
    try {
      setIsSubmitting(true);

      const formattedData = {
        name: data.name,
        venue: data.venue,
        event_type: data.event_type as EventType,
        university_id: data.university_id,
        poc: fixedPocId,
        status: data.status as EventStatus,
        start_datetime: data.start_datetime.toISOString(),
        end_datetime: data.end_datetime.toISOString(),
        is_daily_checklist: data.is_daily_checklist,
      };

      if (data.event_type === "section_specific" && data.section_id) {
        (formattedData as any).section_id = data.section_id;
      }

      console.log("Submitting event data:", formattedData);

      const { data: newEvent, error } = await supabase
        .from("events")
        .insert(formattedData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Event created",
        description: "Your event has been created successfully",
      });

      if (onSuccess && newEvent) {
        onSuccess(newEvent as Event);
      }

      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast({
        title: "Error creating event",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Add a new event to your calendar. Fill out the details below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Event name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="venue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venue</FormLabel>
                  <FormControl>
                    <Input placeholder="Event venue" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="event_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="university_specific">
                          University
                        </SelectItem>
                        <SelectItem value="section_specific">
                          Section
                        </SelectItem>
                        <SelectItem value="user_specific">User</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="university_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>University</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select university" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {universities.map((university) => (
                        <SelectItem
                          key={university.university_id || university.id}
                          value={university.university_id || university.id}
                        >
                          {university.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {eventType === "section_specific" && (
              <FormField
                control={form.control}
                name="section_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredSections.map((section) => (
                          <SelectItem
                            key={section.section_id || section.id}
                            value={section.section_id || section.id}
                          >
                            {section.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_datetime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date & Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP HH:mm")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (date) {
                              const currentDate = field.value || new Date();
                              const hours = currentDate.getHours();
                              const minutes = currentDate.getMinutes();

                              date.setHours(hours, minutes);
                              field.onChange(date);
                            }
                          }}
                          initialFocus
                        />
                        <div className="p-3 border-t border-border">
                          <Input
                            type="time"
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value
                                .split(":")
                                .map(Number);
                              const date = field.value || new Date();
                              date.setHours(hours, minutes);
                              field.onChange(new Date(date));
                            }}
                            value={
                              field.value
                                ? `${field.value
                                    .getHours()
                                    .toString()
                                    .padStart(2, "0")}:${field.value
                                    .getMinutes()
                                    .toString()
                                    .padStart(2, "0")}`
                                : ""
                            }
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_datetime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date & Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP HH:mm")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (date) {
                              const currentDate = field.value || new Date();
                              const hours = currentDate.getHours();
                              const minutes = currentDate.getMinutes();

                              date.setHours(hours, minutes);
                              field.onChange(date);
                            }
                          }}
                          initialFocus
                        />
                        <div className="p-3 border-t border-border">
                          <Input
                            type="time"
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value
                                .split(":")
                                .map(Number);
                              const date = field.value || new Date();
                              date.setHours(hours, minutes);
                              field.onChange(new Date(date));
                            }}
                            value={
                              field.value
                                ? `${field.value
                                    .getHours()
                                    .toString()
                                    .padStart(2, "0")}:${field.value
                                    .getMinutes()
                                    .toString()
                                    .padStart(2, "0")}`
                                : ""
                            }
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_daily_checklist"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Daily Checklist</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Mark this event as a daily checklist item
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Event"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

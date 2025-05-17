import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";

interface AnnouncementFormProps {
  onSuccess?: () => void;
}

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters long",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters long",
  }),
  publishFrom: z.date({
    required_error: "Publish from date is required",
  }),
  publishUntil: z.date().nullable().optional(),
  targetType: z.enum(["university", "section", "role"], {
    required_error: "Target type is required",
  }),
  targetValue: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ onSuccess }) => {
  const { createAnnouncement } = useAnnouncements();
  const { toast } = useToast();
  const { universities, sections } = useData();
  const [selectedTargets, setSelectedTargets] = useState<
    { type: "university" | "section" | "role"; value: string; label: string }[]
  >([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      publishFrom: new Date(),
      publishUntil: null,
      targetType: "university",
      targetValue: "",
    },
  });

  const targetType = form.watch("targetType");

  const handleAddTarget = async () => {
    const targetType = form.getValues("targetType") as
      | "university"
      | "section"
      | "role";
    const targetValue = form.getValues("targetValue");

    if (!targetValue) {
      toast({
        title: "Target value required",
        description: "Please select a value for the target",
        variant: "destructive",
      });
      return;
    }

    // Check if target already exists
    const targetExists = selectedTargets.some(
      (target) => target.type === targetType && target.value === targetValue
    );

    if (targetExists) {
      toast({
        title: "Target already added",
        description: "This target has already been added",
        variant: "destructive",
      });
      return;
    }

    // Get a displayable label for the target
    let label = targetValue;
    if (targetType === "university") {
      const university = universities.find(
        (u) => u.id === targetValue || u.university_id === targetValue
      );
      label = university ? university.name : targetValue;
    } else if (targetType === "section") {
      const section = sections.find(
        (s) => s.id === targetValue || s.section_id === targetValue
      );
      label = section ? section.name : targetValue;
    } else if (targetType === "role") {
      label = targetValue.charAt(0).toUpperCase() + targetValue.slice(1);
    }

    setSelectedTargets([
      ...selectedTargets,
      { type: targetType, value: targetValue, label },
    ]);

    // Reset target value
    form.setValue("targetValue", "");
  };

  const removeTarget = (index: number) => {
    setSelectedTargets(selectedTargets.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormValues) => {
    if (selectedTargets.length === 0) {
      toast({
        title: "No targets selected",
        description: "Please add at least one target audience",
        variant: "destructive",
      });
      return;
    }

    const result = await createAnnouncement(
      data.title,
      data.content,
      data.publishFrom,
      data.publishUntil,
      selectedTargets
    );

    if (result.success) {
      form.reset();
      setSelectedTargets([]);
      if (onSuccess) onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Announcement title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Announcement content"
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="publishFrom"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Publish From</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className="w-full pl-3 text-left font-normal"
                      >
                        {field.value ? (
                          format(field.value, "PPP")
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
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="publishUntil"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Publish Until (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className="w-full pl-3 text-left font-normal"
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>No end date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      initialFocus
                      disabled={(date) => {
                        // Disable dates before publishFrom
                        const publishFrom = form.getValues("publishFrom");
                        return publishFrom ? date < publishFrom : false;
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  If not set, the announcement will be published indefinitely
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Target Audience</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <FormField
              control={form.control}
              name="targetType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select target type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="university">University</SelectItem>
                      <SelectItem value="section">Section</SelectItem>
                      <SelectItem value="role">Role</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Value</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select target value" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {targetType === "university" &&
                        universities.map((university) => (
                          <SelectItem
                            key={university.id || university.university_id}
                            value={university.id || university.university_id}
                          >
                            {university.name}
                          </SelectItem>
                        ))}
                      {targetType === "section" &&
                        sections.map((section) => (
                          <SelectItem
                            key={section.id || section.section_id}
                            value={section.id || section.section_id}
                          >
                            {section.name}
                          </SelectItem>
                        ))}
                      {targetType === "role" && (
                        <>
                          <SelectItem value="instructor">Instructor</SelectItem>
                          <SelectItem value="mentor">Mentor</SelectItem>
                          <SelectItem value="event_manager">
                            Event Manager
                          </SelectItem>
                          <SelectItem value="college_admin">
                            College Admin
                          </SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-end">
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={handleAddTarget}
              >
                Add Target
              </Button>
            </div>
          </div>
        </div>

        {selectedTargets.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Selected Targets:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedTargets.map((target, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-3 py-1 flex items-center"
                >
                  <span className="capitalize mr-1">{target.type}:</span>
                  <span>{target.label}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-2"
                    onClick={() => removeTarget(index)}
                  >
                    ×
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Button type="submit" className="w-full">
          Create Announcement
        </Button>
      </form>
    </Form>
  );
};

export default AnnouncementForm;

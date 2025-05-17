import { useState, useEffect } from "react";
import { Slot } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useSlots = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [slots, setSlots] = useState<Slot[]>([]);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setIsLoading(true);

        const { data: slotsData, error: slotsError } = await supabase.from(
          "slots"
        ).select(`
            *,
            sections(*),
            responsible_person:users!slots_responsible_person_fkey(name),
            linked_event:events!slots_linked_event_id_fkey(name, venue, start_datetime, end_datetime),
            linked_topic:topics!slots_linked_topic_id_fkey(name, duration)
          `);

        if (slotsData && !slotsError && slotsData.length > 0) {
          const transformedSlots: Slot[] = slotsData.map((slot) => ({
            id: slot.slot_id,
            slot_id: slot.slot_id,
            slot_type: slot.slot_type,
            slot_name: slot.slot_name,
            section_id: slot.section_id,
            section_name: slot.sections?.name,
            university_id: slot.university_id,
            responsible_person:
              slot.responsible_person?.name || slot.responsible_person,
            linked_event_id: slot.linked_event_id,
            linked_topic_id: slot.linked_topic_id,
            start_datetime: slot.start_datetime,
            end_datetime: slot.end_datetime,
            topic: slot.topic,
            created_at: slot.created_at,
            date: slot.start_datetime,
            end_date: slot.end_datetime,
            event_name: slot.linked_event?.name,
            event_venue: slot.linked_event?.venue,
            topic_name: slot.linked_topic?.name,
            topic_duration: slot.linked_topic?.duration,
          }));

          setSlots(transformedSlots);
        } else {
          console.log("No slots found in database, using dummy slots data");
          const dummySlots = generateAprilToJune2025Slots();
          setSlots(dummySlots);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load slots:", error);
        toast({
          title: "Failed to load slots",
          description: "An error occurred while loading slots",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchSlots();
  }, []);

  return { slots, isLoading };
};

const generateAprilToJune2025Slots = (): Slot[] => {
  const slots: Slot[] = [];
  const slotTypes: (
    | "exam"
    | "learning_session"
    | "guest_lecture"
    | "topic_discussion"
  )[] = ["exam", "learning_session", "guest_lecture", "topic_discussion"];

  const slotNamesByType = {
    exam: ["Final Exam", "Mid-term Exam", "Quiz", "Test"],
    learning_session: ["Lecture", "Tutorial", "Lab", "Workshop"],
    guest_lecture: [
      "Industry Expert Talk",
      "Alumni Speaker",
      "Professional Workshop",
    ],
    topic_discussion: [
      "Group Discussion",
      "Case Study",
      "Problem Solving Session",
      "Review Session",
    ],
  };

  const responsiblePersons = [
    "Dr. Smith",
    "Prof. Johnson",
    "Dr. Williams",
    "Prof. Brown",
    "Dr. Jones",
    "Prof. Miller",
    "Dr. Davis",
    "Prof. Garcia",
    "Dr. Rodriguez",
    "Prof. Wilson",
  ];

  const sectionIds = [
    "sec-uni-1-1",
    "sec-uni-1-2",
    "sec-uni-1-3",
    "sec-uni-2-1",
    "sec-uni-2-2",
  ];

  const baseDate = new Date(2025, 3, 1);

  generateMonthlySlots(
    slots,
    baseDate,
    slotTypes,
    slotNamesByType,
    responsiblePersons,
    sectionIds
  );

  const mayDate = new Date(2025, 4, 1);
  generateMonthlySlots(
    slots,
    mayDate,
    slotTypes,
    slotNamesByType,
    responsiblePersons,
    sectionIds
  );

  const juneDate = new Date(2025, 5, 1);
  generateMonthlySlots(
    slots,
    juneDate,
    slotTypes,
    slotNamesByType,
    responsiblePersons,
    sectionIds
  );

  return slots;
};

const generateMonthlySlots = (
  slots: Slot[],
  baseDate: Date,
  slotTypes: (
    | "exam"
    | "learning_session"
    | "guest_lecture"
    | "topic_discussion"
  )[],
  slotNamesByType: Record<string, string[]>,
  responsiblePersons: string[],
  sectionIds: string[]
) => {
  const month = baseDate.getMonth();
  const year = baseDate.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= 7; day++) {
    if (day % 7 !== 0) {
      const sessionsPerDay = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < sessionsPerDay; i++) {
        addSlot(
          slots,
          new Date(year, month, day),
          "learning_session",
          slotNamesByType,
          responsiblePersons,
          sectionIds
        );
      }

      if (Math.random() < 0.2) {
        addSlot(
          slots,
          new Date(year, month, day),
          "topic_discussion",
          slotNamesByType,
          responsiblePersons,
          sectionIds
        );
      }
    }
  }

  for (let day = 8; day <= 14; day++) {
    if (day % 7 !== 0) {
      for (let i = 0; i < 2; i++) {
        addSlot(
          slots,
          new Date(year, month, day),
          "learning_session",
          slotNamesByType,
          responsiblePersons,
          sectionIds
        );
      }

      if (Math.random() < 0.4) {
        addSlot(
          slots,
          new Date(year, month, day),
          "topic_discussion",
          slotNamesByType,
          responsiblePersons,
          sectionIds
        );
      }

      if (Math.random() < 0.1) {
        addSlot(
          slots,
          new Date(year, month, day),
          "guest_lecture",
          slotNamesByType,
          responsiblePersons,
          sectionIds
        );
      }
    }
  }

  for (let day = 15; day <= 21; day++) {
    if (day % 7 !== 0) {
      const sessionsPerDay = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < sessionsPerDay; i++) {
        addSlot(
          slots,
          new Date(year, month, day),
          "learning_session",
          slotNamesByType,
          responsiblePersons,
          sectionIds
        );
      }

      if (Math.random() < 0.5) {
        addSlot(
          slots,
          new Date(year, month, day),
          "exam",
          slotNamesByType,
          responsiblePersons,
          sectionIds
        );
      }
    }
  }

  for (let day = 22; day <= 28; day++) {
    if (day % 7 !== 0) {
      const sessionsPerDay = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < sessionsPerDay; i++) {
        addSlot(
          slots,
          new Date(year, month, day),
          "learning_session",
          slotNamesByType,
          responsiblePersons,
          sectionIds
        );
      }

      if (Math.random() < 0.3) {
        addSlot(
          slots,
          new Date(year, month, day),
          "topic_discussion",
          slotNamesByType,
          responsiblePersons,
          sectionIds
        );
      }

      if (Math.random() < 0.2) {
        addSlot(
          slots,
          new Date(year, month, day),
          "guest_lecture",
          slotNamesByType,
          responsiblePersons,
          sectionIds
        );
      }
    }
  }

  if (daysInMonth > 28) {
    for (let day = 29; day <= daysInMonth; day++) {
      if (day % 7 !== 0) {
        addSlot(
          slots,
          new Date(year, month, day),
          "learning_session",
          slotNamesByType,
          responsiblePersons,
          sectionIds
        );

        if (Math.random() < 0.7) {
          addSlot(
            slots,
            new Date(year, month, day),
            "exam",
            slotNamesByType,
            responsiblePersons,
            sectionIds
          );
        }

        if (Math.random() < 0.5) {
          addSlot(
            slots,
            new Date(year, month, day),
            "topic_discussion",
            slotNamesByType,
            responsiblePersons,
            sectionIds
          );
        }
      }
    }
  }
};

const addSlot = (
  slots: Slot[],
  date: Date,
  slotType: "exam" | "learning_session" | "guest_lecture" | "topic_discussion",
  slotNamesByType: Record<string, string[]>,
  responsiblePersons: string[],
  sectionIds: string[]
) => {
  const slotNames = slotNamesByType[slotType];
  const slotName = slotNames[Math.floor(Math.random() * slotNames.length)];

  const startDate = new Date(date);
  const hour = 8 + Math.floor(Math.random() * 10); // 8am to 6pm
  const minute = [0, 15, 30, 45][Math.floor(Math.random() * 4)]; // quarter hour intervals
  startDate.setHours(hour, minute, 0, 0);

  let durationHours = 1; // default

  switch (slotType) {
    case "exam":
      durationHours = 2 + Math.floor(Math.random() * 2); // 2-3 hours
      break;
    case "learning_session":
      durationHours = 1 + (Math.random() < 0.5 ? 0.5 : 0); // 1 or 1.5 hours
      break;
    case "guest_lecture":
      durationHours = 1 + Math.floor(Math.random() * 2); // 1-2 hours
      break;
    case "topic_discussion":
      durationHours = 1; // always 1 hour
      break;
  }

  const endDate = new Date(startDate);
  endDate.setHours(startDate.getHours() + Math.floor(durationHours));
  if (durationHours % 1 > 0) {
    endDate.setMinutes(startDate.getMinutes() + 30);
  }

  const responsiblePerson =
    responsiblePersons[Math.floor(Math.random() * responsiblePersons.length)];
  const sectionId = sectionIds[Math.floor(Math.random() * sectionIds.length)];

  const subjects = [
    "Mathematics",
    "Computer Science",
    "Physics",
    "Chemistry",
    "Biology",
    "History",
    "Literature",
  ];
  const subject = subjects[Math.floor(Math.random() * subjects.length)];
  const slotId = `slot-${date.getMonth()}-${date.getDate()}-${hour}-${minute}-${slotType}`;

  slots.push({
    id: slotId,
    slot_id: slotId,
    slot_name: `${slotName} - ${subject}`,
    slot_type: slotType,
    section_id: sectionId,
    responsible_person: responsiblePerson,
    start_datetime: startDate.toISOString(),
    end_datetime: endDate.toISOString(),
    date: startDate.toISOString(),
    end_date: endDate.toISOString(),
    linked_event_id: null,
    linked_topic_id: null,
    created_at: new Date().toISOString(),
    university_id: "default-university",
  });
};

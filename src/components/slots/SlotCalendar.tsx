import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, isSameDay } from 'date-fns';
import { useSlots } from '@/hooks/useSlots';
import { Slot } from '@/types';
import { Loader2 } from 'lucide-react';
import SlotBadge from './SlotBadge';

interface SlotDetailsProps {
  slot: Slot;
}

const SlotDetails: React.FC<SlotDetailsProps> = ({ slot }) => {
  return (
    <Card className="mb-2">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{slot.slot_name}</CardTitle>
            <CardDescription>
              {slot.start_datetime ? format(new Date(slot.start_datetime), 'h:mm a') : 'TBD'} - 
              {slot.end_datetime ? format(new Date(slot.end_datetime), 'h:mm a') : 'TBD'}
            </CardDescription>
          </div>
          <SlotBadge slotType={slot.slot_type} />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-sm text-muted-foreground">
          <p>Responsible: {slot.responsible_person}</p>
          {slot.linked_event_id && <p>Linked to event: {slot.linked_event_id}</p>}
          {slot.linked_topic_id && <p>Topic: {slot.linked_topic_id}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

const SlotCalendar: React.FC = () => {
  const { slots, isLoading } = useSlots();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get slots for the selected date
  const slotsForSelectedDate = slots.filter(slot => 
    slot.start_datetime && isSameDay(new Date(slot.start_datetime), selectedDate)
  );

  // Function to highlight dates with slots
  const hasSlotsOnDay = (date: Date) => {
    return slots.some(slot => 
      slot.start_datetime && isSameDay(new Date(slot.start_datetime), date)
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <Card className="md:w-1/2">
        <CardHeader>
          <CardTitle>Academic Calendar</CardTitle>
          <CardDescription>View scheduled slots and events</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                  const hasSlots = hasSlotsOnDay(date);
                  if (hasSlots) {
                    setIsDialogOpen(true);
                  }
                }
              }}
              modifiers={{
                hasSlot: (date) => hasSlotsOnDay(date)
              }}
              modifiersStyles={{
                hasSlot: { backgroundColor: 'rgba(var(--primary), 0.2)' }
              }}
              className="rounded-md border"
            />
          )}
        </CardContent>
      </Card>

      <Card className="md:w-1/2">
        <CardHeader>
          <CardTitle>
            Slots for {format(selectedDate, 'PPPP')}
          </CardTitle>
          <CardDescription>
            {slotsForSelectedDate.length} slot(s) scheduled
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {slotsForSelectedDate.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No slots scheduled for this date
                </div>
              ) : (
                <ScrollArea className="h-[350px] pr-4">
                  {slotsForSelectedDate
                    .sort((a, b) => {
                      if (!a.start_datetime || !b.start_datetime) return 0;
                      return new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime();
                    })
                    .map((slot) => (
                      <SlotDetails key={slot.slot_id} slot={slot} />
                    ))
                  }
                </ScrollArea>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                View All Slots
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Slots for {format(selectedDate, 'PPPP')}</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[60vh] pr-4">
                {slotsForSelectedDate
                  .sort((a, b) => {
                    if (!a.start_datetime || !b.start_datetime) return 0;
                    return new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime();
                  })
                  .map((slot) => (
                    <SlotDetails key={slot.slot_id} slot={slot} />
                  ))
                }
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SlotCalendar;

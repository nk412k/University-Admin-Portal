
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Slot } from '@/types';
import { cn } from '@/lib/utils';

interface SlotBadgeProps {
  slotType: Slot['slot_type'];
  className?: string;
}

const SlotBadge: React.FC<SlotBadgeProps> = ({ slotType, className }) => {
  const badgeVariant = 
    slotType === 'exam' ? 'destructive' : 
    slotType === 'guest_lecture' ? 'purple' :
    slotType === 'learning_session' ? 'blue' : 'secondary';

  const displayText = slotType.replace('_', ' ');
  
  return (
    <Badge 
      variant={badgeVariant} 
      className={cn("capitalize", className)}
    >
      {displayText}
    </Badge>
  );
};

export default SlotBadge;


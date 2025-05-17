import React from "react";
import { format, parseISO } from "date-fns";
import { ChecklistDataItem } from "@/hooks/useEventChecklists";
import { Checklist, EventChecklist } from "@/types";

interface PrintableChecklistProps {
  eventName: string;
  date: string;
  checklist: Checklist;
  eventChecklist: EventChecklist;
  items: ChecklistDataItem[];
}

interface HeaderProps {
  title: string;
  eventName: string;
  date: string;
  dueDate: string;
}

interface StatusDisplayProps {
  status: string;
}

interface ChecklistItemProps {
  item: ChecklistDataItem;
}

interface SignatureBlockProps {
  label: string;
}

const PrintableHeader = ({ title, eventName, date, dueDate }: HeaderProps) => (
  <div className="mb-6 text-center">
    <h1 className="text-2xl font-bold">{title}</h1>
    <h2 className="text-xl">{eventName}</h2>
    <p className="text-gray-500">
      {date && format(parseISO(date), "MMMM d, yyyy")}
    </p>
    <p className="text-sm text-gray-500">
      Due by: {format(parseISO(dueDate), "MMMM d, yyyy")}
    </p>
  </div>
);

const ChecklistStatusBar = ({ status }: StatusDisplayProps) => (
  <div className="mb-4 border-b pb-2">
    <div className="flex justify-between">
      <span className="font-bold">Status: </span>
      <span>{status.toUpperCase()}</span>
    </div>
  </div>
);

const ChecklistItem = ({ item }: ChecklistItemProps) => (
  <tr className="border-b">
    <td className="py-3 pl-2">{item.description}</td>
    <td className="py-3 text-center">
      <span className="inline-block rounded-full px-2 py-1 text-xs">
        {item.status?.status.toUpperCase() || "PENDING"}
      </span>
    </td>
    <td className="py-3 pr-2 text-right">{item.status?.remarks || "-"}</td>
  </tr>
);

const SignatureBlock = ({ label }: SignatureBlockProps) => (
  <div>
    <p className="mb-2 font-bold">{label}:</p>
    <div className="mt-8 border-t border-gray-400 pt-1 text-center">
      Signature / Date
    </div>
  </div>
);

export const PrintableChecklist: React.FC<PrintableChecklistProps> = ({
  eventName,
  date,
  checklist,
  eventChecklist,
  items,
}) => {
  const checklistTitle = checklist.type.replace("_", " ").toUpperCase();

  return (
    <div className="print-only p-8">
      <PrintableHeader
        title={checklistTitle}
        eventName={eventName}
        date={date}
        dueDate={eventChecklist.due_date}
      />

      <ChecklistStatusBar status={eventChecklist.status} />

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-800">
            <th className="pb-2 pl-2 text-left">Item</th>
            <th className="pb-2 text-center">Status</th>
            <th className="pb-2 pr-2 text-right">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <ChecklistItem key={item.item_id} item={item} />
          ))}
        </tbody>
      </table>

      <div className="mt-8 flex flex-col gap-8">
        <SignatureBlock label="Prepared By" />
        <SignatureBlock label="Verified By" />
      </div>
    </div>
  );
};

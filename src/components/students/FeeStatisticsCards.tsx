
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee } from "lucide-react";

interface FeeStatisticsProps {
  totalFeesAmount: number;
  totalPendingAmount: number;
  overdue: number;
  overduePercentage: number;
  paid: number;
  paidPercentage: number;
}

const FeeStatisticsCards: React.FC<FeeStatisticsProps> = ({
  totalFeesAmount,
  totalPendingAmount,
  overdue,
  overduePercentage,
  paid,
  paidPercentage,
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold flex items-center">
            <IndianRupee className="h-5 w-5 mr-1" />
            {totalFeesAmount.toLocaleString('en-IN')}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold flex items-center">
            <IndianRupee className="h-5 w-5 mr-1" />
            {totalPendingAmount.toLocaleString('en-IN')}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Overdue Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{overdue}</div>
          <p className="text-xs text-muted-foreground">
            {overduePercentage}% of total students
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Fully Paid Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{paid}</div>
          <p className="text-xs text-muted-foreground">
            {paidPercentage}% of total students
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeeStatisticsCards;

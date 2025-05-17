import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, GraduationCap } from "lucide-react";
import { useUniversityDetails } from "@/hooks/useUniversityDetails";

const UniversitiesList: React.FC = () => {
  const { universityDetails, isLoading } = useUniversityDetails();

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Universities</h1>
        <p className="text-muted-foreground">
          Manage and view all participating educational institutions
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {universityDetails.map((university) => (
          <Card key={university.university_id} className="overflow-hidden">
            <CardHeader className="border-b bg-muted/40 p-4">
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                {university.university_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div className="flex flex-col items-center justify-center p-2">
                  <GraduationCap className="mb-1 h-5 w-5 text-primary" />
                  <div className="text-xl font-bold">
                    {university.number_of_students}
                  </div>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
                <div className="flex flex-col items-center justify-center p-2">
                  <Building className="mb-1 h-5 w-5 text-primary" />
                  <div className="text-xl font-bold">
                    {university.number_of_sections}
                  </div>
                  <p className="text-xs text-muted-foreground">Sections</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UniversitiesList;

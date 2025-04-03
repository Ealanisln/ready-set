// src/components/Dashboard/UserView/Sidebar/UserArchiveCard.tsx

import { Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserArchiveCard() {
  return (
    <Card>
      <CardHeader className="border-b bg-red-50 pb-3">
        <CardTitle className="flex items-center text-red-600">
          <Archive className="mr-2 h-5 w-5" />
          Archive User
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <p className="mb-4 text-sm text-slate-600">
          Archiving a user will remove their access to the platform but
          keep their data for record purposes.
        </p>
        <Button
          variant="destructive"
          className="bg-red-600 hover:bg-red-700"
          size="sm"
        >
          Archive User
        </Button>
      </CardContent>
    </Card>
  );
}
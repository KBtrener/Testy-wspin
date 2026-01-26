import React from "react";
import { Card as UiCard, CardContent } from "@/components/ui/card";

const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <UiCard className="shadow-sm">
      <CardContent className="space-y-4 p-6">{children}</CardContent>
    </UiCard>
  );
};

export default Card;

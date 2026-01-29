import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function TodayPage() {
  return (
    <div className="p-6">
      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>Today</div>
          <Button>Test Button</Button>
        </CardContent>
      </Card>
    </div>
  );
}

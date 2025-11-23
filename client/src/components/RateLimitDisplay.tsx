import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface RateLimitDisplayProps {
  nextAvailableTime?: Date;
}

export default function RateLimitDisplay({ nextAvailableTime }: RateLimitDisplayProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    if (!nextAvailableTime) {
      setTimeRemaining("");
      setProgressValue(0);
      return;
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const targetTime = nextAvailableTime.getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeRemaining("");
        setProgressValue(100);
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);

      // Calculate progress (24 hours total)
      const totalMs = 24 * 60 * 60 * 1000;
      const elapsedMs = totalMs - difference;
      setProgressValue((elapsedMs / totalMs) * 100);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [nextAvailableTime]);

  if (!nextAvailableTime || !timeRemaining) return null;

  return (
    <Card className="p-4" data-testid="card-rate-limit">
      <div className="flex items-center gap-3 mb-3">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <div>
          <h4 className="font-semibold text-sm">Rate Limited</h4>
          <p className="text-xs text-muted-foreground">
            Next request available in: <span className="font-mono" data-testid="text-time-remaining">{timeRemaining}</span>
          </p>
        </div>
      </div>
      <Progress value={progressValue} className="h-2" />
    </Card>
  );
}

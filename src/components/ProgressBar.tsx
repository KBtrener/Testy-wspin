import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const percent = Math.min(100, Math.max(0, (current / total) * 100));
  return <Progress value={percent} aria-label="Postęp" />;
};

export default ProgressBar;

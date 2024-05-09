import { Progress } from "@/components/ui/progress";
interface ProgressComponentProps {
  progress: number;
}
const ProgressComponent = ({ progress }: ProgressComponentProps) => {
  return <Progress value={progress} className="w-full" />;
};

export default ProgressComponent;

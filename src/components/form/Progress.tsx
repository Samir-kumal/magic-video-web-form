import { Progress } from "@/components/ui/progress";

const ProgressComponent = ({progress}) => {
  return <Progress value={progress} className="w-full" />;
};

export default ProgressComponent;

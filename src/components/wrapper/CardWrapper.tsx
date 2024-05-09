import { Card } from "@/components/ui/card";

interface CardWrapperProps {
  children: React.ReactNode;
}

const CardWrapper = ({ children }: CardWrapperProps) => {
  return <Card className="w-1/2 mb-20">{children}</Card>;
};

export default CardWrapper;

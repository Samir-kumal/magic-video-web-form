// import { VideoProps } from "@/context/DataContext";
import { CardContent } from "../ui/card";
import { LoadingSpinner } from "../ui/loadingSpinner";

interface LoadingMessageProps {
  isProcessing: boolean;
  serverMsg: string;
  // videos?: VideoProps[] | null;
}

const LoadingMessage = ({ isProcessing, serverMsg }: LoadingMessageProps) => {
  const textColor =
    serverMsg === "Error loading videos" ? "text-red-500" : "text-black";

  const ShowSpinner = () => {
    if (isProcessing && serverMsg !== "No videos found") {
      return <LoadingSpinner />;
    } else {
      return null;
    }
  };

  const Message = () => {
    if (serverMsg) {
      return (
        <CardContent className="w-full flex items-center gap-x-2 justify-center">
          <ShowSpinner />
          <p className={`text-sm ${textColor}`}>{serverMsg}</p>
        </CardContent>
      );
    }
  };
  return <Message />;
};

export default LoadingMessage;

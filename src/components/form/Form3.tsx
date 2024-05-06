import React from "react";
import data from "@/data/data.json";
import ReactPlayer from "react-player";
import { Card, CardContent } from "../ui/card";

type HoveredVideo = {
  state: boolean;
  id: string | null;
};
const Form3 = () => {
  const [videos, setVideos] = React.useState(data);
  const [selectedVideo, setSelectedVideo] = React.useState(data[0]);
  const [isHovered, setIsHovered] = React.useState<HoveredVideo>({
    state: false,
    id: null,
  });
  const handleMouseEnter = (videId: string) => {
    setIsHovered((prev) => {
      return {
        ...prev,
        state: true,
        id: videId,
      };
    });
  };
  const handleMouseLeave = () => {
    setIsHovered((prev) => {
      return {
        ...prev,
        state: true,
        id: null,
      };
    });
  };
  return (
    <div>
      <section>
        <h1>Form3</h1>
        <Card className="flex flex-row flex-wrap items-center justify-center shadow-none border-0">
          {videos.map((video) => (
            <CardContent
              key={video.id}
              className={"w-1/4"}
              onMouseEnter={() => handleMouseEnter}
              onMouseLeave={() => handleMouseLeave}
            >
              <ReactPlayer
                url={video.videoUrl}
                width={"100%"}
                height={"100%"}
                playing={isHovered.state}
              />
            </CardContent>
          ))}
        </Card>
      </section>
    </div>
  );
};

export default Form3;

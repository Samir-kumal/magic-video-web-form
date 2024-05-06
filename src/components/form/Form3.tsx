import React from "react";
import data from "@/data/data.json";
import ReactPlayer from "react-player";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type HoveredVideo = {
  state: boolean;
  id: string | null;
};

type SelectedVideo = (typeof data)[0];
const Form3 = () => {
  const [videos, setVideos] = React.useState(data);
  const [selectedVideo, setSelectedVideo] =
    React.useState<SelectedVideo | null>(null);
  const [isHovered, setIsHovered] = React.useState<HoveredVideo>({
    state: false,
    id: null,
  });

  const users = [
    {
      id: "1",
      name: "John Doe",
    },
    {
      id: "2",
      name: "Jane Doe",
    },
    {
      id: "3",
      name: "John Smith",
    },
  ];
  const [selectedSubject, setSelectedSubject] = React.useState("");
  const handleMouseEnter = (videId: string) => {
    console.log(videId);
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
  const handleSubjectChange = (value: React.SetStateAction<string>) => {
    setSelectedSubject(value);
  };

  console.log(isHovered.state);
  console.log("selected Subject", selectedSubject);
  return (
    <Card className="border-none">
      <section>
        <CardHeader>
          <CardTitle>
            Step 3 - Select the video you want to Create Magic Video of
          </CardTitle>
        </CardHeader>
        <section className="w-full flex justify-end">
          <Select onValueChange={handleSubjectChange}>
            <SelectTrigger className="w-[180px] outline-none  ">
              <SelectValue placeholder="Subjects" />
            </SelectTrigger>
            <SelectContent className=" outline-none">
              {users.map((item) => (
                <SelectItem key={item.id} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>
        <CardContent className="w-1/2">
          {" "}
          <CardDescription>Selected Subject</CardDescription>{" "}
          <CardDescription className="text-black text-bold">
            {selectedSubject}
          </CardDescription>
        </CardContent>
        <Card className="flex flex-row flex-wrap items-center justify-center shadow-none border-0">
          {videos &&
            videos.length > 0 &&
            videos.map((video) => (
              <CardContent
                key={video.id}
                className={`w-1/4 flex items-center justify-center h-44 `}
                onMouseEnter={() => handleMouseEnter(video.id)}
                onMouseLeave={() => handleMouseLeave()}
                onClick={() => setSelectedVideo(video)}
              >
                <ReactPlayer
                  url={video.videoUrl}
                  width={"100%"}
                  light={video.thumbnailUrl}
                  stopOnUnmount={true}
                  height={"100%"}
                  style={{
                    objectFit: "cover",
                    transition: "all",
                    borderRadius: "0px",
                    border:
                      (isHovered.id === video.id && isHovered.state) ||
                      selectedVideo?.id === video.id
                        ? "3px solid black"
                        : "none",
                    padding:
                      (isHovered.id === video.id && isHovered.state) ||
                      selectedVideo?.id === video.id
                        ? "3px"
                        : "0",
                  }}
                  playing={isHovered.id === video.id && isHovered.state}
                />
              </CardContent>
            ))}
        </Card>
      </section>
    </Card>
  );
};

export default Form3;

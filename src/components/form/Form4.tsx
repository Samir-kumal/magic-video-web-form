import React, { useCallback, useEffect, useState } from "react";
// import data from "@/data/data.json";
import ReactPlayer from "react-player";
// import { Player, ControlBar } from "video-react";

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
import useDataProvider from "@/hooks/useDataProvider";
import axios from "axios";
import { BASE_URL, VideoProps } from "@/context/DataContext";
import io from "socket.io-client";
import { LoadingSpinner } from "../ui/loadingSpinner";
import LoadingMessage from "../common/LoadingMessage";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { LoadingSpinner } from "../ui/loadingSpinner";
// import { Progress } from "@radix-ui/react-progress";

const socket = io(BASE_URL);
type HoveredVideo = {
  state: boolean;
  id: string | null;
};

const Form4 = () => {
  const { setSelectedSubjectId } = useDataProvider();
  const [isLoading, setIsLoading] = useState(true);
  const [videos, setVideos] = useState<VideoProps[] | null>([]);
  const { videosSubjects } = useDataProvider();
  const { selectedVideo, setSelectedVideo, testUser } = useDataProvider();
  const [isProcessing, setIsProcessing] = useState(false);
  const [serverMsg, setServerMsg] = useState("loading videos");
  const [isHovered, setIsHovered] = useState<HoveredVideo>({
    state: false,
    id: null,
  });
  const [selectedSubject, setSelectedSubject] = useState({
    subject_id: "",
    subject_name: "",
  });
  const [error, setError] = useState({
    isError: false,
    message: "",
  });

  useEffect(() => {
    getVideoFiles();
  }, []);

  const getVideoFiles = useCallback(
    async (value = "") => {
      if (!isLoading) {
        setIsLoading(true);
      }
      try {
        const result = await axios.post(`${BASE_URL}/api/files`, {
          subject_id: value,
          testuser: "bean",
        });
        if (result.data) {
          setIsLoading(false);
        }
        if (result.data.length > 0) {
          setVideos(result.data);
        } 
        else {
          setVideos([]);
        }
        setIsProcessing(false);
        console.log(result.data.length);
      } catch (error) {
        setIsLoading(false);
        setVideos(null);
        setIsProcessing(false);
        console.log(error);
      }
    },
    [selectedSubject]
  );

  socket.on("files_task", (data) => {
    console.log("Task event received", data.data);
    if (data.data === "Detecting") {
      setServerMsg("Detecting the videos");
      setIsProcessing(true);
    } else if (data.data === "Detected") {
      setServerMsg("Detected the videos with similar content");
      setIsProcessing(false);
    } else if (data.data === "Not Detected") {
      setServerMsg("No videos found");
      setVideos(null);
      setIsProcessing(false);
    }
  });

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
  const handleSubjectChange = (value: string) => {
    console.log("The selected value is ", value);
    setSelectedSubjectId(value);
    const subject = videosSubjects?.find(
      (item) => item.subject_id === value
    )?.subject_name;
    if (value) {
      setSelectedSubject((previous) => ({
        ...previous,
        subject_id: value,
        subject_name: subject as string,
      }));
      getVideoFiles(value);
    }
  };

  console.log("selected Subject", selectedVideo);
  console.log("isProcessing", isProcessing);
  return (
    <Card className="border-none shadow-none">
      <section>
        <CardHeader>
          <CardTitle>
            Some of the Similar Videos Based on Your Location
          </CardTitle>
        </CardHeader>
        <section className="w-full px-2 flex justify-end">
          <Select onValueChange={handleSubjectChange}>
            <SelectTrigger className="w-[180px] outline-none  ">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent className=" outline-none">
              {videosSubjects
                ? videosSubjects.map((item) => (
                    <SelectItem key={item.subject_id} value={item.subject_id}>
                      {item.subject_name}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        </section>
        <CardContent className="w-1/2">
          <CardDescription>Selected Location</CardDescription>{" "}
          <CardDescription className="text-black text-bold">
            {selectedSubject?.subject_name}
          </CardDescription>
        </CardContent>
        <Card className="flex flex-row flex-wrap items-center justify-center shadow-none border-0">
          {!isLoading && videos && videos.length > 0 ? (
            videos.slice(0, 12).map((video) => (
              <CardContent
                key={video.video_id}
                className={`w-1/4 flex items-center justify-center h-44 mx-2 overflow-hidden `}
                onMouseEnter={() => handleMouseEnter(video.video_id)}
                onMouseLeave={() => handleMouseLeave()}
                onClick={() => setSelectedVideo(video)}
                style={{
                  objectFit: "cover",
                  transition: "all",
                  borderRadius: "0px",
                }}
              >
                <ReactPlayer
                  url={video?.download_url}
                  width={"100%"}
                  // light={video?.download_url}
                  stopOnUnmount={true}
                  height={"100%"}
                  style={{
                    objectFit: "cover",
                    transition: "all",
                    borderRadius: "0px",
                    border:
                      (isHovered.id === video.video_id && isHovered.state) ||
                      selectedVideo?.video_id === video.video_id
                        ? "3px solid black"
                        : "none",
                    padding:
                      (isHovered.id === video.video_id && isHovered.state) ||
                      selectedVideo?.video_id === video.video_id
                        ? "3px"
                        : "0",
                  }}
                  playing={isHovered.id === video.video_id && isHovered.state}
                />
                {/* 
                <Player autoPlay={false} src={video?.download_url}>
                  <ControlBar autoHide={true} className="my-class" />
                </Player> */}
              </CardContent>
            ))
          ) : (
            <LoadingMessage isProcessing={isLoading} serverMsg={serverMsg} videos = {videos} />
          )}
        </Card>
      </section>
    </Card>
  );
};

export default Form4;
// {videos === null && !isLoading && (
//   <CardContent className="w-full flex items-center gap-x-2 justify-center">
//     <p className="text-sm">No videos found</p>
//   </CardContent>
// )}

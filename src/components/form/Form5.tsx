import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import ReactPlayer from "react-player";
import {  useForm } from "react-hook-form";
import { Button } from "../ui/button";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "@/context/DataContext";
import { Progress } from "@/components/ui/progress";
import useDataProvider from "@/hooks/useDataProvider";
import io from "socket.io-client";
import { LoadingSpinner } from "../ui/loadingSpinner";
import { Player, ControlBar } from "video-react";

const socket = io(BASE_URL);

type FormInputs = {
  duration: number;
  marked_time: number;
};
interface Form5Props {
  handlePreviousPage: () => void;
}

const Form5 = ({ handlePreviousPage }: Form5Props) => {
  const { selectedVideo, uploadedVideo, testUser, selectedSubjectId } =
    useDataProvider();
  const playerRef = useRef(null);
  const [markedTime, setMarkedTime] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [inputDuration, setInputDuration] = useState<number>(0);
  const [validDuration, setValidDuration] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>();
  const [progress, setProgress] = useState({
    isStarted: false,
    value: 0,
    isFailed: false,
    isCompleted: false,
  });
  const [uploadMsg, setUploadMsg] = useState("");
  const [url, setUrl] = useState({
    state: false,
    url: "",
  });

  socket.on("magic_video_task", (data) => {
    console.log("Task event received", data.data);
    if (data.data === "Magic Video Processing start") {
      setIsProcessing(true);
      setUploadMsg("Creating Magic Video..");
    } else if (data.data === "Magic Video Done") {
      setUploadMsg("Magic Video Created Successfully");
      setIsProcessing(false);
    }
    setUploadMsg("Video processing started...");
  });
  const onSubmit = async (data: any) => {
    data.marked_time = formattedTime;
    const values = {
      ...data,
      testuser: "bean",
      subject_id: selectedSubjectId,
    };
    console.log("new data", values);
    setProgress((previousState) => ({
      ...previousState,
      isStarted: true,
      isFailed: false,
    }));
    try {
      const response = await axios.post(
        `${BASE_URL}/api/get_magic_video`,
        values,

        {
          onDownloadProgress: (progressEvent) => {
            if (progressEvent && progressEvent.progress) {
              setUploadMsg("Creating Magic Video..");
              console.log(
                "Upload Progress: " +
                  Math.round(progressEvent.progress * 100) +
                  "%"
              );
            }
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        console.log(response.data.success);
        setUploadMsg(response.data.success);
        setIsCompleted(true);
        setUrl((prev) => ({
          ...prev,
          state: true,
          url: `${BASE_URL}/api/magic_video_download`,
        }));
        setProgress((previousState) => ({
          ...previousState,
          isCompleted: true,
          //   isStarted: false,
        }));
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err.response?.data);
        setUploadMsg("File upload failed");
        setProgress((previousState) => ({
          ...previousState,
          isFailed: true,
        }));
      } else {
        console.log(err);
        setUploadMsg("File upload failed");
        setProgress((previousState) => ({
          ...previousState,
          isFailed: true,
        }));
      }
    }
  };

  const handlePause = () => {
    if (playerRef.current) {
      const playerInstance = playerRef.current as ReactPlayer;
      const currentTime = playerInstance.getCurrentTime();
      console.log(`Video paused at ${currentTime} seconds`);
      const roundedTime = parseFloat(currentTime.toFixed(0));
      setMarkedTime(Number(roundedTime));
      setValue("marked_time", Number(roundedTime));
    }
  };
  const handleDuration = (duration: any) => {
    console.log(`The video is ${duration} seconds long.`);
    setVideoDuration(duration);
  };
  const handleInputChange = (e: any) => {
    console.log("input");
    setInputDuration(Number(e.target.value));
    console.log("duration:", inputDuration);
  };
  useEffect(() => {
    console.log("marked time", markedTime);
    console.log("duration:", inputDuration);
    console.log("valid:", inputDuration + (markedTime ?? 0));
    setValidDuration(inputDuration + (markedTime ?? 0) > videoDuration);
    console.log(validDuration);
  }, [inputDuration, markedTime, videoDuration]);

  const dateString = "2024-04-17 10:00:00";

  // Create a Date object from the string
  const dateObject = new Date(dateString);

  // Extract hours, minutes, and seconds
  const hours = dateObject.getHours();
  var minutes = dateObject.getMinutes();
  const seconds = dateObject.getSeconds();
  // const givenTimeMilliseconds = markedTime * 100;
  // console.log("ml", givenTimeMilliseconds);
  var newSeconds = seconds + markedTime;

  // Check if adding 3 seconds causes the minutes to increment
  if (newSeconds >= 60) {
    // Increment minutes and reset seconds
    minutes++;
    newSeconds -= 60; // Subtract 60 to get the remaining seconds after incrementing minutes
  }

  // Update the seconds in the Date object
  // baseTime.setSeconds(newSeconds);

  // Format the updated time
  const formattedTime = `2024-04-17 ${hours
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${newSeconds
    .toString()
    .padStart(2, "0")}`;

  console.log("ft", formattedTime);

  const handlePreviousPageHandler = () => {
    handlePreviousPage();
  };

  console.log("uploaded video", uploadedVideo?.name);
  //   const videoBlob = new Blob([uploadedVideo], { type: uploadedVideo?.type });

  return (
    <>
      <CardHeader>
        <CardTitle>Step 4 - Create magic video</CardTitle>
      </CardHeader>
      <Card className="flex items-center justify-center border-0  shadow-none">
        {url.state ? (
          <CardContent className="w-full h-fit">
            <Player autoPlay src={url.url}>
            <ControlBar autoHide={false} className="my-class" />
          </Player>
          <Button className="mt-4">
                  <a href={url.url}>Download Video</a>
                </Button>
                <Button
                  type="button"
                  onClick={handlePreviousPageHandler}
                  className="mt-4 float-end"
                >
                  Previous
                </Button>
          </CardContent>
        ) : (
          <CardContent className="gap-2">
            {(uploadedVideo || selectedVideo) && (
              <ReactPlayer
                ref={playerRef}
                url={
                  !uploadedVideo
                    ? selectedVideo?.download_url
                    : URL.createObjectURL(
                        new Blob([uploadedVideo], { type: uploadedVideo?.type })
                      )
                }
                width={"100%"}
                height={"100%"}
                onPause={handlePause}
                onDuration={handleDuration}
                controls
              />
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
              <div className="flex flex-col mb-2">
                <label htmlFor="marked_time">Marked Time</label>
                <input
                  className="p-2 border rounded-md mt-1 appearance-none"
                  id="marked_time"
                  type="number"
                  {...register("marked_time", {
                    required: {
                      value: true,
                      message: "This field is required",
                    },
                    validate: {
                      required: (value) => {
                        if (value > videoDuration)
                          return "The marked time shouldn't exceed the video duration";
                        if (value < 0) return "Please enter a positive number";
                        return true;
                      },
                    },
                  })}
                />
                {errors.marked_time && (
                  <span className="text-red-500">
                    {errors.marked_time.message}
                  </span>
                )}
                <div className="text-sm text-gray-500">
                  Pause the video on the time you want to capture the magic
                  moment
                </div>
              </div>
              <div className="flex flex-col mb-2">
                <label htmlFor="duration">Duration</label>
                <input
                  className="p-2 border rounded-md mt-1 appearance-none"
                  id="duration"
                  type="number"
                  onInput={handleInputChange}
                  {...register("duration", {
                    required: {
                      value: true,
                      message: "This field is required",
                    },
                    validate: {
                      required: (value) => {
                        if (validDuration)
                          return "The duration should not exceed the video size";
                        if (value < 0) return "Please enter a positive number";
                        return true;
                      },
                    },
                  })}
                />
                {errors.duration && (
                  <span className="text-red-500">
                    {errors.duration.message}
                  </span>
                )}
                <div className="text-sm text-gray-500">
                  Insert the duration of the magic moment you want to capture
                </div>
              </div>
              <section className="flex gap-x-4 translate-y-6 justify-end">
                <Button
                  type="button"
                  onClick={handlePreviousPageHandler}
                  className="mt-5 float-end"
                >
                  Previous
                </Button>
                <Button type="submit" className="mt-5 float-end">
                  Create Magic Video
                </Button>
              </section>
              <section className={`${isProcessing ? "flex" : ""}`}>
                {isProcessing ? (
                  <div className=" w-fit px-1">
                    <LoadingSpinner className="" size="14" />
                  </div>
                ) : (
                  <Progress
                    value={progress.value}
                    className={` w-40 h-[3px] ${
                      progress.value === 0 ? "hidden" : ""
                    } `}
                    classNameCustom={
                      progress.isFailed ? "bg-red-500" : `bg-green-500`
                    }
                  />
                )}
                <p className="text-[12px]">{uploadMsg}</p>
              </section>
              {/* {url.state && (
                <Button className="mt-1">
                  <a href={url.url}>Download Video</a>
                </Button>
              )} */}
            </form>
          </CardContent>
        )}
      </Card>
    </>
  );
};

export default Form5;

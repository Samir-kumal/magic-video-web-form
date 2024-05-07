import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import ReactPlayer from "react-player";
import { Form, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import axios from "axios";
import { BASE_URL } from "@/context/DataContext";
import { Progress } from "@radix-ui/react-progress";

type FormInputs = {
  duration: number;
  marked_time: number;
};

const Form4 = () => {
  const playerRef = useRef(null);
  const [markedTime, setMarkedTime] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [inputDuration, setInputDuration] = useState<number>(0);
  const [validDuration, setValidDuration] = useState(false);
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
  });
  const [uploadMsg, setUploadMsg] = useState("");
  const [url, setUrl] = useState(false);
  const onSubmit = async (data: any) => {
    // console.log("Form data:", data);
    // console.log("Marked Time:", data.marked_time);
    // console.log("ft,", formattedTime);
    data.marked_time = formattedTime;
    console.log("new data", data);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/get_magic_video`,
        data,

        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent && progressEvent.progress) {
              setUploadMsg("Creating Magic Video..");
              console.log(
                "Upload Progress: " +
                  Math.round(progressEvent.progress * 100) +
                  "%"
              );
              setProgress((previousState) => ({
                ...previousState,
                isStarted: true,
                isFailed: false,
                value: Math.round(progressEvent.progress * 100),
              }));
            }
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // if (response.data) {
      //   console.log(response.data.status);
      //   // setUploadMsg("Magic Video Created Successfully");
      // }
      console.log(response.data.success);
      // console.log(response.data.url);
      setUrl(true);
      setUploadMsg(response.data.success);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.errors) {
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
  return (
    <>
      <CardHeader>
        <CardTitle>Step 4 - Create magic video</CardTitle>
      </CardHeader>
      <Card className="flex items-center justify-center border-0 shadow-none">
        <CardContent className="gap-2">
          <ReactPlayer
            ref={playerRef}
            url={"src/assets/bean2.mp4"}
            width={"100%"}
            height={"100%"}
            onPause={handlePause}
            onDuration={handleDuration}
            controls
          />
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
                Pause the video on the time you want to capture the magic moment
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
                <span className="text-red-500">{errors.duration.message}</span>
              )}
              <div className="text-sm text-gray-500">
                Insert the duration of the magic moment you want to capture
              </div>
            </div>
            <Button type="submit" className="mt-5 float-end">
              Create Magic Video
            </Button>
            {/* <p className="text-[10px]">{uploadMsg}</p> */}
            {progress.isStarted && (
              <section>
                <Progress
                  value={progress.value}
                  className="w-40 h-[3px] "
                  classNameCustom={
                    progress.isFailed ? "bg-red-500" : `bg-green-500`
                  }
                />
                <p className="text-[12px]">{uploadMsg}</p>
              </section>
            )}
            {url && (
              <>
                <Button className="mt-1">
                  <a href="http://192.168.1.151:5001/api/magic_video_download">
                    Download Video
                  </a>
                </Button>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default Form4;

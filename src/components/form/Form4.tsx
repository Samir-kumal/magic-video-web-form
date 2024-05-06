import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "../ui/card";
import ReactPlayer from "react-player";
import { Form, useForm } from "react-hook-form";
import { Button } from "../ui/button";

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

  const onSubmit = (data: any) => {
    console.log("Form data:", data);
    console.log("Marked Time:", data.marked_time);
    console.log("Marked Time actual:", markedTime);
  };
  const handlePause = () => {
    if (playerRef.current) {
      const playerInstance = playerRef.current as ReactPlayer;
      const currentTime = playerInstance.getCurrentTime();
      console.log(`Video paused at ${currentTime} seconds`);
      setMarkedTime(Number(currentTime));
      setValue("marked_time", Number(currentTime));
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
  return (
    <>
      <Card className="flex items-center justify-center border-0 shadow-none">
        <CardContent className="gap-2">
          <ReactPlayer
            ref={playerRef}
            url={"src/assets/mrbean(cliped).mp4"}
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
                step={0.000001}
                {...register("marked_time", {
                  required: true,
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
                step={0.000001}
                onInput={handleInputChange}
                {...register("duration", {
                  required: true,
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
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default Form4;

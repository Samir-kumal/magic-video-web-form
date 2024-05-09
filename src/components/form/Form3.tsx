import React, { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

import useDataProvider from "@/hooks/useDataProvider";
import axios from "axios";
import { BASE_URL } from "@/context/DataContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Progress } from "@/components/ui/progress";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type HoveredVideo = {
  state: boolean;
  id: string | null;
};

const Form3 = () => {
  const [file, setFile] = useState<File | null>(null);
  const [location, setLocation] = useState("");
  const { setUploadedVideo, videosSubjects } = useDataProvider();

  const [selectedSubject, setSelectedSubject] = React.useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState({
    isError: false,
    message: "",
  });
  const [progress, setProgress] = useState({
    isStarted: false,
    value: 0,
    isFailed: false,
    isCompleted: false,
  });
  const [uploadMsg, setUploadMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setUploadMsg("");
    if (!selectedFile) {
      setError((previous) => {
        return {
          ...previous,
          isError: true,
          message: "No file selected",
        };
      });
    } else if (selectedFile.size > 100000000) {
      setError((previous) => {
        return {
          ...previous,
          isError: true,
          message: "File size is too large",
        };
      });
    } else if (selectedFile.type !== "video/mp4") {
      setError((previous) => {
        return {
          ...previous,
          isError: true,
          message: "File type not supported",
        };
      });
    } else {
      setError((previous) => {
        return {
          ...previous,
          isError: false,
          message: "",
        };
      });
      setFile(selectedFile);
      // handleFileUpload();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError({
        isError: true,
        message: "No file selected",
      });
      return;
    }
    if (location.length === 0) {
      setError({
        isError: true,
        message: "Location is required",
      });
      return;
    }
    setProgress((previousState) => ({
      ...previousState,
      isStarted: true,
    }));
    handleFileUpload();
  };
  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append("file", file as File);
    formData.append("name", file?.name as string);
    formData.append("location", location);

    try {
      const result = await axios.post(
        `${BASE_URL}/api/upload_video`,
        formData,

        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent && progressEvent.progress) {
              setUploadMsg("Uploading...");
              console.log(
                "Upload Progress: " +
                  Math.round(progressEvent.progress * 100) +
                  "%"
              );
              setProgress((previousState) => ({
                ...previousState,
                // isStarted: true,
                isFailed: false,
                isCompleted: false,
                value: Math.round(
                  progressEvent.progress === undefined
                    ? 0
                    : progressEvent.progress * 100
                ),
              }));
            }
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(result);
      // setVideoUrl(url);
      // handleTestVideoDownload();
      // setShouldGoNext(true);
      if (result.data) {
        setUploadedVideo(file);
        setUploadMsg("File uploaded successfully");
        setProgress((previousState) => ({
          ...previousState,
          isCompleted: true,
        }));
      }
    } catch (error) {
      console.log(error);
      setUploadMsg("File upload failed");
      setProgress((previousState) => ({
        ...previousState,
        isFailed: true,
      }));
    } finally {
      setProgress((previousState) => ({
        ...previousState,
        isStarted: false,
      }));
    }
  };

  const buttonDisabled = () => {
    let isDisabled = true;
    if (isProcessing || progress.isStarted) {
      return isDisabled;
    } else if (file === null && location.length === 0) {
      return isDisabled;
    } else if (
      (file !== null && location.length > 0) ||
      progress.isCompleted ||
      progress.isFailed
    ) {
      isDisabled = false;
      return isDisabled;
    } else {
      return isDisabled;
    }
  };

  const handleSubjectChange = (value: string) => {
    setUploadMsg("");
    console.log("The selected value is ", value);
    const location = videosSubjects?.find((item) => item.subject_id === value);
    console.log("The Location of the video is ", location?.subject_name);
    setLocation(location?.subject_name as string);
  };

  return (
    <Card className="border-none shadow-none">
      <section>
        <CardHeader>
          <CardTitle>
            Step 3 - Select the video you want to Create Magic Video of
          </CardTitle>
        </CardHeader>

        <Card className="border-0 shadow-none ">
          <CardHeader>Upload a video</CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              <Input
                className="my-2"
                type="file"
                accept="video/*"
                onChange={handleChange}
              />
              <Label className="my-2">Location</Label>

              <section className="my-2">
                <Select onValueChange={handleSubjectChange}>
                  <SelectTrigger className="w-[180px] outline-none  ">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent className=" outline-none">
                    {videosSubjects
                      ? videosSubjects.map((item) => (
                          <SelectItem
                            key={item.subject_id}
                            value={item.subject_id}
                          >
                            {item.subject_name}
                          </SelectItem>
                        ))
                      : null}
                  </SelectContent>
                </Select>
              </section>

              {error.isError && (
                <p className="text-red-500 text-[12px]">{error.message}</p>
              )}
              <section className=" flex items-center gap-x-10">
                <Button disabled={buttonDisabled()} type="submit">
                  Upload
                </Button>

                <section className={`${isProcessing ? "flex" : ""}`}>
                  {progress.isStarted && (
                    <Progress
                      value={progress.value}
                      className="w-40 h-[3px]"
                      classNameCustom={
                        progress.isFailed ? "bg-red-500" : "bg-green-500"
                      }
                    />
                  )}

                  <p className="text-[10px]">{uploadMsg}</p>
                </section>
              </section>
            </form>
          </CardContent>
        </Card>
      </section>
    </Card>
  );
};

export default Form3;

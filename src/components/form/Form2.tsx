import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";
import { Progress } from "../ui/progress";
import useDataProvider from "@/hooks/useDataProvider";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { BASE_URL } from "@/context/DataContext";
import ReactPlayer from "react-player";

const Form2 = () => {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState({
    isError: false,
    message: "",
  });
  const [progress, setProgress] = useState({
    isStarted: false,
    value: 0,
    isFailed: false,
  });
  const [uploadMsg, setUploadMsg] = useState("");

  // 1. Define your form.

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append("file", file as File);
    formData.append("name", file?.name as string);

    try {
      const result = await axios.post(
        `${BASE_URL}/api/testupload`,
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
                isStarted: true,
                isFailed: false,
                value: Math.round(progressEvent.progress * 100),
              }));
            }
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(result);
      setUploadMsg("File uploaded successfully");
      // handleTestVideoDownload(result.data);
    } catch (error) {
      console.log(error);
      setUploadMsg("File upload failed");
      setProgress((previousState) => ({
        ...previousState,
        isFailed: true,
      }));
    }
  };

  // const handleTestVideoDownload = async (data: BlobPart) => {
  //   try {
  //     const result = await axios.get(`${BASE_URL}/api/testvideo_download`, {
  //       responseType: "blob",
  //     });
  //     const blob = new Blob([data], { type: "video/mp4" });
  //     console.log(blob);
  //     const url = window.URL.createObjectURL(new Blob([data]));
  //     console.log(url);
  //     setVideoUrl(url);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const handleTestVideoDownload = async (data: BlobPart) => {
    try {
      const result = await axios.get(
        `${BASE_URL}/api/testupload_download`,

        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent && progressEvent.progress) {
              setUploadMsg("downloading...");
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
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(result);
      setUploadMsg("File downloaded successfully");
      // handleTestVideoDownload(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;

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
    }
  };

  // 2. Define a submit handler.
  function onSubmit(e) {
    e.preventDefault();
    if (!file) {
      setError({
        isError: true,
        message: "No file selected",
      });
      return;
    }
    handleFileUpload();
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("values", "file uploaded");
  }

  console.log("value of progress", progress.value);
  console.log("value of file", file);
  return (
    <>
      {videoUrl.length ===0 ? 
        <>
          <CardHeader>
            <CardTitle>
              Step 2 - Insert a video of a subject you want to test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-8">
              <section>
                <Input type="file" accept="video/*" onChange={handleChange} />
                {/* <FormMessage /> */}
                {/* {error.isError && <FormMessage>{error.message}</FormMessage>} */}
                {error.isError && (
                  <p className="text-red-500 text-[12px]">{error.message}</p>
                )}
              </section>
              <section className="w-full flex items-center justify-between">
                <section className="flex items-center justify-center gap-x-10">
                  <Button type="submit">Upload</Button>
                  {progress.isStarted && (
                    <section>
                      <Progress
                        value={progress.value}
                        className="w-40 h-[3px] "
                        classNameCustom={
                          progress.isFailed ? "bg-red-500" : `bg-green-500`
                        }
                      />
                      <p className="text-[10px]">{uploadMsg}</p>
                    </section>
                  )}
                </section>
              </section>
            </form>
          </CardContent>
        </> : <ReactPlayer url={videoUrl} controls={true} />
      }
    </>
  );
};

export default Form2;

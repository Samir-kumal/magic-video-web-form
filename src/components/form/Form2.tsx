import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";
import { Progress } from "../ui/progress";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { BASE_URL } from "@/context/DataContext";
import ReactPlayer from "react-player";
import useDataProvider from "@/hooks/useDataProvider";
import { Loader } from "lucide-react";
import { LoadingSpinner } from "../ui/loadingSpinner";
import "video-react/dist/video-react.css"; // import css
import { Player, ControlBar } from "video-react";
import io from "socket.io-client";

const socket = io(BASE_URL);

const Form2 = () => {
  const [file, setFile] = useState<File | null>(null);
  const { setShouldGoNext } = useDataProvider();
  // const url = `http://192.168.1.151:5000/api/files/download/Dhani_Bau_Ko_Chhori.mp4`;
  // const url = `http://192.168.1.151:5000/api/files/download/output.mp4`;
  const url = `http://192.168.1.151:5001/api/testupload_download`;
  console.log("The url for the download link is ", url);
  const [videoUrl, setVideoUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
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

  socket.on("task", (data) => {
    console.log("Task event received", data.data);
    if (data.data === "Upload successful") {
      setUploadMsg("File uploaded successfully");
    }
     else if (data.data === "Processing start") {
      setUploadMsg("Processing the video");
      setIsProcessing(true);
    }
     else if (data.data === "Processing complete") {
      setUploadMsg("File processed Successfully");
      setIsProcessing(false);
    }
    setUploadMsg("Video processing started...");
  });

  // Listen for socket event indicating video processing completed

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

      setVideoUrl(url);
      // handleTestVideoDownload();
      setShouldGoNext(true);
    } catch (error) {
      console.log(error);
      setUploadMsg("File upload failed");
      setProgress((previousState) => ({
        ...previousState,
        isFailed: true,
      }));
    }
  };

  // const handleTestVideoDownload = async () => {
  //   const BASE_URI = `${BASE_URL}/api/testupload_download`; // Replace with your video URL
  //   const downloadDirectory = "@/data/videos";
  //   const VIDEO_ENDPOINT = "/api/testupload_download"; // Replace with your video endpoint
  //   const filename = "downloaded_video.mp4"; // Specify the filename

  //   try {
  //     const response = await axios.get(`${BASE_URI}${VIDEO_ENDPOINT}`, {
  //       responseType: "blob",
  //     });

  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const downloadPath = `${downloadDirectory}/${filename}`;

  //     // Create a temporary anchor tag to trigger the download
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", downloadPath);
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // const handleTestVideoDownload = async (data: BlobPart) => {
  //   try {
  //     const result = await axios.get(
  //       `${BASE_URL}/api/testupload_download`,

  //       {
  //         onUploadProgress: (progressEvent) => {
  //           if (progressEvent && progressEvent.progress) {
  //             setUploadMsg("downloading...");
  //             console.log(
  //               "Upload Progress: " +
  //                 Math.round(progressEvent.progress * 100) +
  //                 "%"
  //             );
  //             setProgress((previousState) => ({
  //               ...previousState,
  //               isStarted: true,
  //               isFailed: false,
  //               value: Math.round(progressEvent.progress * 100),
  //             }));
  //           }
  //         },
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     console.log("The result from the Form 2", result);
  //     setUploadMsg("File downloaded successfully");
  //     // handleTestVideoDownload(result.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
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
      // handleFileUpload();
    }
  };

  // 2. Define a submit handler.
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
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
      {videoUrl.length === 0 ? (
        <>
          <CardHeader>
            <CardTitle>
              Step 2 - Insert a video of a subject you want to test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
             onSubmit={onSubmit} 
             className="space-y-8">
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
                  {/* <LoadingSpinner className="" size="14" /> */}
                  <Button disabled= {isProcessing || progress.isStarted || !file} type="submit">Upload</Button>
                  {progress.isStarted && (
                    <section className={`${isProcessing ? "flex" : ""}`}>
                      {isProcessing ? (
                        <div className=" w-fit px-1">
                          <LoadingSpinner className="" size="14" />
                        </div>
                      ) : (
                        <Progress
                          value={progress.value}
                          className="w-40 h-[3px] "
                          classNameCustom={
                            progress.isFailed ? "bg-red-500" : `bg-green-500`
                          }
                        />
                      )}
                      <p className="text-[10px]">{uploadMsg}</p>
                    </section>
                  )}
                </section>
              </section>
            </form>
          </CardContent>
        </>
      ) : (
        <div className=" h-fit my-4 mx-4">
          {/* <ReactPlayer
            url={url}
            controls={true}
            height={"100%"}
            width={"100%"}
          /> */}
          <Player autoPlay src={url}>
            <ControlBar autoHide={false} className="my-class" />
          </Player>
        </div>
      )}
    </>
  );
};

export default Form2;

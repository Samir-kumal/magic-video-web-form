import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import axios from "axios";
import { useEffect, useState } from "react";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { BASE_URL } from "@/context/DataContext";
import useDataProvider from "@/hooks/useDataProvider";
import "video-react/dist/video-react.css"; // import css
import { Player, ControlBar } from "video-react";
import io from "socket.io-client";
import Modal from "../common/Modal";

const socket = io(BASE_URL);

const Form2 = () => {
  const [file, setFile] = useState<File | null>(null);
  const { setShouldGoNext } = useDataProvider();

  const url = `${BASE_URL}/api/testupload_download`;
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
  const [isCompleted, setIsCompleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Define your form.

  useEffect(() => {
    socket.on("task", (data) => {
      console.log("Task event received", data.data);
      if (data.data === "Upload successful") {
        setUploadMsg("File uploaded successfully");
      } else if (data.data === "Processing start") {
        setUploadMsg("Processing the video");
        setIsProcessing(true);
      } else if (data.data === "Processing complete") {
        setUploadMsg("File processed Successfully");
        setIsProcessing(false);
        setIsCompleted(true);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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
            if (progressEvent) {
              setUploadMsg("Uploading...");
              console.log(
                "Upload Progress: " +
                  Math.round(
                    progressEvent.progress === undefined
                      ? 0
                      : progressEvent.progress * 100
                  ) +
                  "%"
              );
              setIsModalOpen(true);

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
      setShouldGoNext(true);
    } catch (error) {
      console.log(error);
      setUploadMsg("File upload failed");
      setProgress((previousState) => ({
        ...previousState,
        isFailed: true,
      }));
    } finally {
      setTimeout(() => {
        setIsModalOpen(false);
        setProgress((previousState) => ({
          ...previousState,
          isStarted: false,
          value: 0,
        }));
        setUploadMsg("");
      }, 1000);
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
    // setProgress((previousState) => ({
    //   ...previousState,
    //   isStarted: true,
    //   value: 0,
    // }));
    // setIsModalOpen(true);
    // setUploadMsg("File uploading...");
    // setInterval(() => {
    //   setProgress((previousState) => ({
    //     ...previousState,
    //     value: previousState.value + 25,
    //   }));
    // }, 1000);
    // setTimeout(() => {
    //   setUploadMsg("Processing the Video...");
    //   setIsProcessing(true);
    // }, 3000);
    // setTimeout(() => {
    //   setUploadMsg("Video Successfully Processed...");
    //   setIsProcessing(false);
    //   setIsCompleted(true);
    //   setProgress((previousState) => ({
    //     ...previousState,
    //     value: 0,
    //     isStarted: false,
    //   }));
    // }, 5000);
    // setTimeout(() => {
    //   setIsModalOpen(false);
    //   setIsCompleted(false);

    //   setUploadMsg("");
    // }, 10000);
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
            <form onSubmit={onSubmit} className="space-y-8">
              <section>
                <Input type="file" accept="video/*" onChange={handleChange} />

                {error.isError && (
                  <p className="text-red-500 text-[12px]">{error.message}</p>
                )}
              </section>
              <section className="w-full flex items-center justify-between">
                <section className="flex items-center justify-center gap-x-10">
                  {/* <LoadingSpinner className="" size="14" /> */}
                  <Button
                    disabled={isProcessing || progress.isStarted || !file}
                    type="submit"
                  >
                    Upload
                  </Button>
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
      {isModalOpen && (
        <Modal
          uploadMsg={uploadMsg}
          isProcessing={isProcessing}
          isCompleted={isCompleted}
          formNumber={2}
          progressValue={progress.value}
          isStarted={progress.isStarted}
          progress={progress}
        />
      )}
    </>
  );
};

export default Form2;

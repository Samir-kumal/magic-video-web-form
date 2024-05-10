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
import useDataProvider from "@/hooks/useDataProvider";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { BASE_URL } from "@/context/DataContext";
import Modal from "../common/Modal";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

const Form1 = () => {
  const { setShouldGoNext, setTestUser } = useDataProvider();
  const [file, setFile] = useState<File | null>(null);
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); 

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const handleFileUpload = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    const formData = new FormData();
    formData.append("file", file as File);
    // formData.append("name", file?.name as string);
    formData.append("name", values.username);

    try {
      const result = await axios.post(
        `${BASE_URL}/api/trainvideo_upload`,
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

              if (progressEvent.progress === 1) {
                setUploadMsg("Training the model");
                setIsProcessing(true);
                setTimeout(()=>{
                  setUploadMsg("Please wait ....")
                }, 1000)
              }
            }
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(result);
      setUploadMsg(" Model Trained successfully");
      setIsCompleted(true);
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
        setUploadMsg("");
        setIsCompleted(false);
      }, 1000);
      setProgress((previousState) => ({
        ...previousState,
        isStarted: false,
        value: 0,
      }));
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    console.log(selectedFile);
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
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!file) {
      setError({
        isError: true,
        message: "No file selected",
      });
      return;
    }
  
    handleFileUpload(values);
    setTestUser(values.username);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  console.log("value of progress", progress.value);
  return (
    <>
      <CardHeader>
        <CardTitle>
          Step 1 - Insert the name and a video of the subject you want to train
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />

                  <FormControl>
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={handleChange}
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                  {error.isError && <FormMessage>{error.message}</FormMessage>}
                </FormItem>
              )}
            />
            <section className="w-full flex items-center justify-between">
              <section className="flex items-center justify-center gap-x-10">
                <Button disabled={!file} type="submit">
                  Upload the video
                </Button>
              </section>
            </section>
          </form>
        </Form>
      </CardContent>
      {isModalOpen && (
        <Modal
          uploadMsg={uploadMsg}
          progress={progress}
          progressValue={progress.value}
          isCompleted={isCompleted}
          formNumber={1}
          isStarted={progress.isStarted}
          isProcessing={isProcessing}
        />
      )}
    </>
  );
};

export default Form1;

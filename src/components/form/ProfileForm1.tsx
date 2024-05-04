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

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  file: z.string().min(2, {
    message: "No file selected.",
  }),
});

export const BASE_URL = "http://localhost:3000";
const ProfileForm1 = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState({
    isStarted: false,
    value: 0,
    isFailed: false,
  });
  const [uploadMsg, setUploadMsg] = useState("");

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
    formData.append("name", file?.name as string);
    formData.append("username", values.username);
    // setProgress({
    //   isStarted: true,
    //   value: 0,
    //   isFailed: false,
    // });
    try {
      const result = await axios.post(
        `${BASE_URL}/api/upload`,
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
    } catch (error) {
      console.log(error);
      setUploadMsg("File upload failed");
      setProgress((previousState) => ({
        ...previousState,
        isFailed: true,
      }));
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleNextPage = () => {
    console.log("Next Page");
  };
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // handleFileUpload(values);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  console.log("value of progress", progress.value)
  return (
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
                <Input type="file" accept="video/*" onChange={handleChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <section className="w-full flex items-center justify-between">
          <section className="flex items-center justify-center gap-x-10">
            <Button type="submit">
              Submit
            </Button>
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
          <Button type="button" onClick={handleNextPage}>
            Next
          </Button>
        </section>
      </form>
    </Form>
  );
};

export default ProfileForm1;

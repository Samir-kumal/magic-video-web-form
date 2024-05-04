import { useEffect, useState } from "react";
import ProfileForm from "./components/form/ProfileForm1";
import CardWrapper from "./components/wrapper/CardWrapper";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import ProgressComponent from "./components/form/Progress";
import ProfileForm1 from "./components/form/ProfileForm1";

const App = () => {
  const [progress, setProgress] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setProgress((oldProgress) => {
  //       if (oldProgress === 100) {
  //         return 0;
  //       }
  //       return oldProgress + 25;
  //     });
  //   }, 500);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // },[]);
  return (
    <div className="w-screen h-screen bg-slate-300">
      <section className="w-screen h-1/2 pt-32 flex flex-col items-center justify-center">
        <div className="py-6">
          <h1 className="text-2xl font-bold">Magic Video Web App</h1>
        </div>
        <section className="flex w-1/2 justify-around my-2">
          <h2
            className={`text-xl font-bold transition-all ${
              progress === 25 ? "bg-black text-white" : "bg-white text-black"
            } bg-white p-4 rounded-full w-10 h-10 flex items-center justify-center`}
          >
            1
          </h2>
          <h2
            className={`text-xl font-bold transition-all ${
              progress === 50 ? "bg-black text-white" : "bg-white text-black"
            } bg-white p-4 rounded-full w-10 h-10 flex items-center justify-center`}
          >
            2
          </h2>
          <h2
            className={`text-xl font-bold transition-all ${
              progress === 75 ? "bg-black text-white" : "bg-white text-black"
            } bg-white p-4 rounded-full w-10 h-10 flex items-center justify-center`}
          >
            3
          </h2>
          <h2
            className={`text-xl font-bold transition-all ${
              progress === 100 ? "bg-black text-white" : "bg-white text-black"
            } bg-white p-4 rounded-full w-10 h-10 flex items-center justify-center`}
          >
            4
          </h2>
        </section>
        <CardWrapper>
          {/* <CardHeader>
          
          </CardHeader> */}
          <CardHeader>
            <ProgressComponent progress={progress} />
          </CardHeader>
          {/* <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>This is a card description.</CardDescription>
          </CardHeader> */}
          <CardContent>
            <ProfileForm1 />
          </CardContent>
        </CardWrapper>
      </section>
    </div>
  );
};

export default App;

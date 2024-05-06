import { useEffect, useState } from "react";
import CardWrapper from "./components/wrapper/CardWrapper";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import ProgressComponent from "./components/form/Progress";
import Form from "./components/controller/FormComponent";
import { Button } from "./components/ui/button";
import useDataProvider from "./hooks/useDataProvider";
import { PageAction } from "./context/DataContext";
import ProgressNumHeader from "./components/common/ProgressNumHeader";



const App = () => {
  const [progress, setProgress] = useState(25);
  const { updatePage, page } = useDataProvider();



  const handleNextPage = () => {
    
    setProgress((oldProgress) => {
      if (oldProgress === 100) {
        return 25;
      }
      return oldProgress + 25;
    });
    updatePage(PageAction.NEXT);

  };

  const handlePreviousPage = () => {
    setProgress((oldProgress) => {
      if (oldProgress === 25) {
        return 100;
      }
      return oldProgress - 25;
    });
    updatePage(PageAction.PREVIOUS);
  }

  console.log("page no is ", page)
  return (
    <div className="w-screen h-screen bg-slate-300">
      <section className="w-screen h-fit flex flex-col items-center justify-center">
        <div className="py-6">
          <h1 className="text-2xl font-bold">Magic Video Web App</h1>
        </div>
       <ProgressNumHeader progress={progress} />
        <CardWrapper>
          {/* <CardHeader>
          
          </CardHeader> */}
          <CardHeader>
            <ProgressComponent progress={progress} />
          </CardHeader>
          {/* <CardHeader>
            <CardTitle>Step 1 - Insert the name and a video of the subject you want to train</CardTitle>
          </CardHeader> */}
          {/* <CardContent> */}
            <Form />
          {/* </CardContent> */}
          <CardContent className="flex justify-end gap-x-3">
           {page !==1 && <Button type="button" onClick={handlePreviousPage}>
              Previous
            </Button>}
           {page !==4 && <Button type="button" onClick={handleNextPage}>
              Next
            </Button>}
          </CardContent>
        </CardWrapper>
      </section>
    </div>
  );
};

export default App;

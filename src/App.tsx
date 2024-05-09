import { useState } from "react";
import CardWrapper from "./components/wrapper/CardWrapper";
import { CardContent, CardHeader } from "./components/ui/card";
import ProgressComponent from "./components/form/Progress";
import Form from "./components/controller/FormComponent";
import { Button } from "./components/ui/button";
import useDataProvider from "./hooks/useDataProvider";
import { PageAction } from "./context/DataContext";
import ProgressNumHeader from "./components/common/ProgressNumHeader";
import "./App.css";
import { AuroraBackgroundDemo } from "./Background/AuroraBackgroundDemo";

const App = () => {
  const [progress, setProgress] = useState(20);
  const { updatePage, page, shouldGoNext } = useDataProvider();

  const handleNextPage = () => {
    setProgress((oldProgress) => {
      if (oldProgress === 100) {
        return 20;
      }
      return oldProgress + 20;
    });
    updatePage(PageAction.NEXT);
  };

  const handlePreviousPage = () => {
    setProgress((oldProgress) => {
      if (oldProgress === 20) {
        return 20;
      }
      return oldProgress - 20;
    });
    updatePage(PageAction.PREVIOUS);
  };

  console.log("page no is ", page);
  return (
    <AuroraBackgroundDemo>
      <div className="w-screen min-h-screen max-h-fit ">
        <section className="w-screen h-fit flex flex-col items-center justify-center">
          <div className="py-10">
            <h1 className="text-3xl font-bold">Magic Video Web App</h1>
          </div>
          <ProgressNumHeader progress={progress} />
          <CardWrapper>
            <CardHeader>
              <ProgressComponent progress={progress} />
            </CardHeader>

            <Form handlePreviousPage={handlePreviousPage} />
            {/* </CardContent> */}
            <CardContent className="flex justify-end gap-x-3">
              {page !== 1 && (
                <Button
                  className={`${progress === 100 ? "hidden" : ""}`}
                  type="button"
                  onClick={handlePreviousPage}
                >
                  Previous
                </Button>
              )}
              {page <= 4 && (
                <Button type="button" onClick={handleNextPage}>
                  Next
                </Button>
              )}
            </CardContent>
          </CardWrapper>
        </section>
      </div>
    </AuroraBackgroundDemo>
  );
};

export default App;

import { motion } from "framer-motion";
import { LoadingSpinner } from "../ui/loadingSpinner";
import SuccessComponent from "./SuccessComponent";
import { Progress } from "../ui/progress";

interface ModalProps {
  uploadMsg: string;
  isProcessing?: boolean;
  isCompleted: boolean;
  formNumber?: number;
  progressValue?: number;
  isStarted?: boolean;
  progress?: {
    isFailed: boolean;
  };
}
const Modal = ({
  uploadMsg,
  isProcessing,
  isCompleted,
  formNumber,
  progressValue = 0,
  isStarted,
  progress,
}: ModalProps) => {
  return (
    <div className=" inset-0 fixed z-50  bg-black/20 filter backdrop-blur-sm">
      <motion.div
        className="bg-white p-8 w-96 object-cover  h-fit min-h-40 rounded-lg flex flex-col   items-center justify-start shadow-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* <h1 className="text-center">{uploadMsg}</h1> */}
        <motion.h1
          className="font-bold text-lg mb-5"
          style={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }} // Transition duration
        >
          {uploadMsg}
        </motion.h1>
        {formNumber && progressValue !== 100 && !isProcessing && isStarted && (
          <Progress
            value={progressValue}
            className="h-6"
            classNameCustom={progress?.isFailed ? "bg-red-500" : `bg-green-500`}
          />
        )}
        {/* <h1 className="font-bold text-lg mb-5 ">Creating Magic Video</h1> */}
        {isProcessing && !isCompleted && <LoadingSpinner size="30" />}
        {isCompleted && <SuccessComponent />}
      </motion.div>
    </div>
  );
};

export default Modal;

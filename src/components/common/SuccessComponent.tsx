import Lottie from "lottie-react";
import SuccessAnimation from "@/assets/successAnimation.json";

const SuccessComponent = () => {
  return (
    <div className=" object-cover flex items-center justify-center -translate-y-5  w-28 h-28">
      <Lottie
        style={{ objectFit: "cover" }}
        className="object-cover"
        animationData={SuccessAnimation}
        loop={false}
      />
    </div>
  );
};

export default SuccessComponent;

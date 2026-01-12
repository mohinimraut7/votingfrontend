import React from "react";
import Lottie from "lottie-react";
import animationData from "../Images/loader.json"; // JSON File from LottieFiles

const LoaderLottie = () => {
  return (
    <div style={{ width: 200, height: 200 }}>
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};

export default LoaderLottie;

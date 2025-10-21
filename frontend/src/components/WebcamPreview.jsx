import React, { useRef, useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import Webcam from "react-webcam";
import { updateUser } from "../redux/slices/AuthSlice";

const WebcamPreview = ({ onCapture }) => {
  const webcamRef = useRef(null);
  const dispatch = useDispatch();
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraIsActive, setCameraIsActive] = useState(false);

  // Capture photo
  const capture = useCallback(() => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);

    // Convert base64 → File
    const byteString = atob(imageSrc.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: "image/jpeg" });
    const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });

    if (onCapture) onCapture(file);
  }, [onCapture]);

  const retake = () => setCapturedImage(null);

  // Detect camera state
  useEffect(() => {
    const checkCamera = () => {
      const videoEl = webcamRef.current?.video;
      if (videoEl && videoEl.srcObject) {
        const track = videoEl.srcObject.getVideoTracks()[0];
        setCameraIsActive(track && track.readyState === "live");

        // Track when camera stops (user closes permission or tab)
        track.onended = () => setCameraIsActive(false);
      } else {
        setCameraIsActive(false);
      }
    };

    // Poll a bit until webcam initializes
    const interval = setInterval(checkCamera, 500);
    return () => clearInterval(interval);
  }, [webcamRef.current]);

  return (
    <>
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg bg-black">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-full h-full object-cover"
          onUserMedia={() => setCameraIsActive(true)} // when camera starts
          onUserMediaError={() => setCameraIsActive(false)} // when camera blocked
        />
        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured"
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        )}
        <button
          onClick={capturedImage ? retake : capture}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all"
        >
          {capturedImage ? "Retake" : "Capture"}
        </button>
      </div>

      <p className="mt-2 text-center">
        {cameraIsActive ? (
          <span className="text-green-600 font-medium">Camera is Active</span>
        ) : (
          <span className="text-red-600 font-medium">Camera is Off</span>
        )}
      </p>
    </>
  );
};

export default WebcamPreview;
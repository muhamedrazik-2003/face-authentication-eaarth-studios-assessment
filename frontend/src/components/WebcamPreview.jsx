import React, { useRef, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import Webcam from "react-webcam";
import { updateUser } from "../redux/slices/AuthSlice";

const WebcamPreview = ({ onCapture }) => {
    const webcamRef = useRef(null);
    const dispatch = useDispatch();
    const [capturedImage, setCapturedImage] = useState(null);

    const capture = useCallback(() => {
        if (!webcamRef.current) return;

        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);

        // Convert base64 to File
        const byteString = atob(imageSrc.split(",")[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: "image/jpeg" });
        const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
        
         if (onCapture) onCapture(file);
    }, [webcamRef, onCapture]);

    const retake = () => {
        setCapturedImage(null);
    };

    return (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
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
    );
};

export default WebcamPreview;
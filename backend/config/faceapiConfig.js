const faceapi = require("face-api.js");
const tf = require("@tensorflow/tfjs-node");
const canvas = require("canvas");
const path = require("path");

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const MODEL_PATH = path.join(__dirname, "../faceModels");

const loadModels = async () => {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);
  console.log("Face-api models loaded successfully");
};

const getFaceDescriptor = async (imageBuffer) => {
  const tensor = tf.node.decodeImage(imageBuffer);
  const result = await faceapi
    .detectSingleFace(tensor)
    .withFaceLandmarks()
    .withFaceDescriptor();
  tensor.dispose();

  if (!result) throw new Error("No face detected in the image");
  return result.descriptor;
};

module.exports = { loadModels, getFaceDescriptor, faceapi };

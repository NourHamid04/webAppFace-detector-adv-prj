/*
===========================================================
 Face API - Model Loader & Face Detection Utility
===========================================================

This module is responsible for:
1) Loading the required Face-API.js models only once (cached).
2) Detecting faces from an HTMLVideoElement using TinyFaceDetector.


===========================================================
*/

import * as faceapi from "face-api.js";

let modelsLoaded = false;

export async function loadFaceApiModels() {
  if (modelsLoaded) return;
  
  const MODEL_URL = "/models"; // we’ll serve this folder in public

  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
  ]);

  modelsLoaded = true;
  console.log("Face-API models loaded");
}

export async function detectFaces(video) {
  if (!modelsLoaded) return [];

  const options = new faceapi.TinyFaceDetectorOptions({
    inputSize: 224,
    scoreThreshold: 0.5,
  });

  const results = await faceapi.detectAllFaces(video, options);
  return results;
}

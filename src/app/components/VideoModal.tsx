import React, { useState, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import ThanksModal from "./ThanksModal";
import { FaStar } from "react-icons/fa";

interface ExtraQuestion {
  text: string;
  value: boolean;
  required: boolean;
}

interface VideoModalProps {
  onClose: () => void;
  extraQuestions: ExtraQuestion[];
  spaceId: string | "";
}

const VideoModal: React.FC<VideoModalProps> = ({
  onClose,
  extraQuestions,
  spaceId,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showInputFields, setShowInputFields] = useState(false);
  const [extraQuestionValues, setExtraQuestionValues] = useState<
    Record<string, string>
  >({});
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);

  const handleDeviceUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const blob = new Blob([file], { type: "video/mp4" });
      setVideoBlob(blob);
      setShowInputFields(true);
      if (videoRef.current) {
        const videoURL = URL.createObjectURL(blob);
        videoRef.current.srcObject = null;
        videoRef.current.src = videoURL;
        videoRef.current.play();
      }
    }
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;

      let chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/mp4" });
        setVideoBlob(blob);
        setShowInputFields(true);
        chunks = [];
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          setStream(null);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (e) {
      console.error("Error accessing camera:", e);
      setUploadStatus("Error accessing camera. Please check your permissions.");
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    }
    setIsRecording(false);
  };

  const previewVideo = () => {
    if (videoBlob && videoRef.current) {
      const videoURL = URL.createObjectURL(videoBlob);
      videoRef.current.srcObject = null;
      videoRef.current.src = videoURL;
      videoRef.current.play();
    }
  };

  const uploadVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoBlob) {
      setUploadStatus("No video recorded. Please record or upload a video.");
      return;
    }

    if (!name.trim()) {
      setUploadStatus("Please fill in your name and email.");
      return;
    }

    const unansweredRequired = extraQuestions.filter(
      (q) => q.required && !extraQuestionValues[q.text]
    );
    if (unansweredRequired.length > 0) {
      setUploadStatus(
        `Please answer all required questions: ${unansweredRequired
          .map((q) => q.text)
          .join(", ")}`
      );
      return;
    }

    const formData = new FormData();
    formData.append("video", videoBlob);
    formData.append("name", name);
    formData.append("rating", rating.toString());
    formData.append("spaceId", spaceId);
    formData.append("type", "video");

    formData.append("extraQuestionValues", JSON.stringify(extraQuestionValues));

    try {
      const response = await fetch("/api/uploadVideos", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        setUploadStatus("Video uploaded successfully");
        console.log("Upload response:", responseData);
        onClose();
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      setUploadStatus(
        "Error uploading video. Please check your connection and try again."
      );
    }
  };

  const handleExtraQuestionChange = (
    question: ExtraQuestion,
    value: string
  ) => {
    setExtraQuestionValues({
      ...extraQuestionValues,
      [question.text]: value,
    });
    console.log(extraQuestionValues);
  };

  return (
    <div
      id="video-modal"
      tabIndex={-1}
      aria-hidden="true"
      className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-[calc(100%-1rem)] max-h-full"
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-[#141414]">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Video Recorder/Upload
            </h3>
            <button
              className="absolute top-2 right-2 text-gray-100 hover:text-gray-300"
              onClick={onClose}
            >
              <IoMdClose size={24} />
            </button>
          </div>

          <div className="p-4 md:p-5">
            <div className="flex flex-col items-center space-y-4">
              <video
                ref={videoRef}
                className="w-full h-auto bg-black"
                controls
              />
              <div className="flex space-x-2">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg"
                  >
                    Stop Recording
                  </button>
                )}
                <label className="px-4 py-2 bg-emerald-700 text-white rounded-lg cursor-pointer">
                  Upload from device
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleDeviceUpload}
                  />
                </label>
                {videoBlob && (
                  <button
                    onClick={previewVideo}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                  >
                    Preview Video
                  </button>
                )}
              </div>
            </div>

            {showInputFields && (
              <form
                onSubmit={uploadVideo}
                className="mt-4 space-y-3 bg-[#0b0b0b] p-4 rounded-lg"
              >
                <div className="mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        size={24}
                        color={star <= rating ? "#00FFFF" : "#D1D5DB"}
                        onClick={() => handleRatingChange(star)}
                      />
                    ))}
                  </div>
                </div>
                <h4 className="text-lg font-semibold">Enter Details</h4>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="w-full px-4 py-2 border rounded-lg bg-[#636363] outline-none"
                  required
                />

                {extraQuestions.map((question, index) => (
                  <div key={index} className="mb-4">
                    <label
                      htmlFor={`extra-question-${index}`}
                      className="block text-gray-100 font-bold mb-2"
                    >
                      {question.text}
                    </label>
                    {question.value ? (
                      <input
                        type="text"
                        id={`extra-question-${index}`}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-100 bg-[#636363] leading-tight focus:outline-none focus:shadow-outline"
                        placeholder={question.text}
                        value={extraQuestionValues[question.text] || ""}
                        onChange={(e) =>
                          handleExtraQuestionChange(question, e.target.value)
                        }
                        required={question.required}
                      />
                    ) : (
                      <textarea
                        id={`extra-question-${index}`}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-100 bg-[#636363] leading-tight focus:outline-none focus:shadow-outline"
                        rows={2}
                        placeholder={question.text}
                        value={extraQuestionValues[question.text] || ""}
                        onChange={(e) =>
                          handleExtraQuestionChange(question, e.target.value)
                        }
                        required={question.required}
                      ></textarea>
                    )}
                  </div>
                ))}
                <div className="flex justify-center items-center space-x-4 mt-4">
                  <label className="px-4 py-2 bg-emerald-700 text-white rounded-lg cursor-pointer">
                    {!showInputFields ? "Upload from device" : "Post Again"}
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleDeviceUpload}
                    />
                  </label>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-700 text-white rounded-lg cursor-pointer font-semibold"
                  >
                    Confirm To Send
                  </button>
                </div>
              </form>
            )}
            {uploadStatus && (
              <p className="mt-4 text-center text-white">{uploadStatus}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;

import React, { useState, useRef } from "react";
import { IoMdClose } from "react-icons/io";
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
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showInputFields, setShowInputFields] = useState(false);
  const [extraQuestionValues, setExtraQuestionValues] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [step, setStep] = useState<'record' | 'preview' | 'details'>('record');

  const handleDeviceUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const blob = new Blob([file], { type: "video/mp4" });
      setVideoBlob(blob);
      setStep('preview');
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
      setIsLoading(true);
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
        setStep('preview');
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
    } finally {
      setIsLoading(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    }
    setIsRecording(false);
  };

  const uploadVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoBlob) {
      setUploadStatus("No video recorded. Please record or upload a video.");
      return;
    }

    if (!name.trim()) {
      setUploadStatus("Please fill in your name.");
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

    setIsLoading(true);
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
        setTimeout(() => onClose(), 1500);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      setUploadStatus(
        "Error uploading video. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtraQuestionChange = (question: ExtraQuestion, value: string) => {
    setExtraQuestionValues({
      ...extraQuestionValues,
      [question.text]: value,
    });
  };

  const renderStep = () => {
    switch (step) {
      case 'record':
        return (
          <div className="flex flex-col items-center space-y-4">
            <video
              ref={videoRef}
              className="w-full aspect-video bg-gray-900 rounded-lg"
              controls={!!videoBlob}
            />
            <div className="flex flex-wrap gap-2 justify-center">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading && <div className="animate-spin rounded-full h-10 " ></div>}
                  Start Recording
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  Stop Recording
                </button>
              )}
              <label className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer">
                Upload from device
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleDeviceUpload}
                />
              </label>
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className="flex flex-col items-center space-y-4">
            <video
              ref={videoRef}
              className="w-full aspect-video bg-gray-900 rounded-lg"
              controls
            />
            <div className="flex gap-2">
              <button
                onClick={() => setStep('record')}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
              >
                Record Again
              </button>
              <button
                onClick={() => setStep('details')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 'details':
        return (
          <form onSubmit={uploadVideo} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-gray-200">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={24}
                    className="cursor-pointer transition-colors"
                    color={star <= rating ? "#00FFFF" : "#4B5563"}
                    onClick={() => handleRatingChange(star)}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-200">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            {extraQuestions.map((question, index) => (
              <div key={index} className="flex flex-col gap-2">
                <label className="text-gray-200">
                  {question.text}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {question.value ? (
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                    placeholder={question.text}
                    value={extraQuestionValues[question.text] || ""}
                    onChange={(e) => handleExtraQuestionChange(question, e.target.value)}
                    required={question.required}
                  />
                ) : (
                  <textarea
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                    rows={3}
                    placeholder={question.text}
                    value={extraQuestionValues[question.text] || ""}
                    onChange={(e) => handleExtraQuestionChange(question, e.target.value)}
                    required={question.required}
                  />
                )}
              </div>
            ))}

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setStep('preview')}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading && <div className="animate-spin rounded-full h-10 " ></div>}
                Submit
              </button>
            </div>
          </form>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-xl mx-4 bg-gray-800 rounded-xl shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white">
            {step === 'record' && "Record Video"}
            {step === 'preview' && "Preview Video"}
            {step === 'details' && "Add Details"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <div className="p-4">
          {renderStep()}

          {uploadStatus && (
            <div className={`mt-4 p-3 rounded-lg text-center ${uploadStatus.includes('successfully') ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
              }`}>
              {uploadStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoModal;

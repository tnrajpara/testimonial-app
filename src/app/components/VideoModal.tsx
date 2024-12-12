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
              className="w-full aspect-video bg-zinc-700 rounded-lg"
              controls={!!videoBlob}
            />
            <div className="flex flex-wrap gap-2 justify-center">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  )}
                  Start Recording
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>
                  Stop Recording
                </button>
              )}
              <label className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
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
              className="w-full aspect-video bg-zinc-700 rounded-lg"
              controls
            />
            <div className="flex gap-2">
              <button
                onClick={() => setStep('record')}
                className="px-4 py-2  text-white rounded-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" /></svg>
                Record Again
              </button>
              <button
                onClick={() => setStep('details')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
              >
                Continue
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </button>
            </div>
          </div>
        );

      case 'details':
        return (
          <form onSubmit={uploadVideo} className="space-y-4">
            <div className="space-y-2">
              <label className="text-gray-300 font-medium">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={28}
                    className="cursor-pointer transition-colors duration-200"
                    color={star <= rating ? "#3B82F6" : "#4B5563"}
                    onClick={() => handleRatingChange(star)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-gray-300 font-medium">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
                required
              />
            </div>

            {extraQuestions.map((question, index) => (
              <div key={index} className="space-y-2">
                <label className="text-gray-300 font-medium">
                  {question.text}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {question.value ? (
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
                    placeholder={question.text}
                    value={extraQuestionValues[question.text] || ""}
                    onChange={(e) => handleExtraQuestionChange(question, e.target.value)}
                    required={question.required}
                  />
                ) : (
                  <textarea
                    className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
                    rows={3}
                    placeholder={question.text}
                    value={extraQuestionValues[question.text] || ""}
                    onChange={(e) => handleExtraQuestionChange(question, e.target.value)}
                    required={question.required}
                  />
                )}
              </div>
            ))}

            <div className="flex gap-4 justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep('preview')}
                className="px-6 py-2  text-white rounded-full font-semibold transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" /></svg>
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                )}
                Submit
              </button>
            </div>
          </form>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-xl mx-4 bg-primary-color rounded-xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-2xl font-bold text-white">
            {step === 'record' && "Record Video"}
            {step === 'preview' && "Preview Video"}
            {step === 'details' && "Add Details"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default VideoModal;


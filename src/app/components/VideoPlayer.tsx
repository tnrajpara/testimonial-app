import React, { useState, useEffect } from "react";

interface VideoPlayerProps {
  videoId: string | undefined;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

const VideoPlayer = ({
  videoId,
  isExpanded = false,
  onToggleExpand,
}: VideoPlayerProps) => {
  const [videoLink, setVideoLink] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await fetch(
          `https://api.vimeo.com/videos/${videoId}`,
          {
            headers: {
              Authorization: "Bearer cfc1dfaa656e2c34b56ee17cf91230a4",
            },
          }
        );
        const data = await response.json();

        const customizedUrl = new URL(data.player_embed_url);
        customizedUrl.searchParams.append("title", "0");
        customizedUrl.searchParams.append("byline", "0");
        customizedUrl.searchParams.append("portrait", "0");
        customizedUrl.searchParams.append("playsinline", "0");
        customizedUrl.searchParams.append("autopause", "0");
        customizedUrl.searchParams.append("quality", "1080p");
        customizedUrl.searchParams.append("transparent", "0");
        customizedUrl.searchParams.append("color", "ffffff");
        customizedUrl.searchParams.append("controls", "1");
        customizedUrl.searchParams.append("like", "0");
        customizedUrl.searchParams.append("watchlater", "0");
        customizedUrl.searchParams.append("share", "0");
        customizedUrl.searchParams.append("pip", "0");
        customizedUrl.searchParams.append("dnt", "1");

        setVideoLink(customizedUrl.toString());
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };

    if (videoId) {
      fetchVideoData();
    }
  }, [videoId]);

  if (!videoLink) {
    return <div>Loading...</div>;
  }

  const containerClasses = isExpanded
    ? "fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4"
    : "w-full max-w-xl aspect-video cursor-pointer hover:opacity-90 transition-opacity";

  const videoClasses = isExpanded
    ? "w-full max-w-6xl aspect-video"
    : "w-full h-full";

  return (
    <div className={containerClasses} onClick={onToggleExpand}>
      <div className={videoClasses}>
        {videoLink && (
          <iframe
            src={videoLink}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;

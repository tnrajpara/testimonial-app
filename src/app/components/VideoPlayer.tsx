import React, { useState, useEffect } from "react";

const VideoPlayer = ({ videoId }: { videoId: string | undefined }) => {
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

        // Modify the player embed URL to include customization parameters
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

  return (
    <div className="w-full aspect-video">
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
  );
};

export default VideoPlayer;

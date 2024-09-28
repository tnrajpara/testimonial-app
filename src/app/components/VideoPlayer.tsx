import React, { useState, useEffect } from "react";

const VideoPlayer = ({ videoId }: { videoId: string | undefined }) => {
  const [videoLink, setVideoLink] = useState<any>(null);

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
        setVideoLink(data.player_embed_url);
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };
    fetchVideoData();
  }, [videoId]);

  if (!videoLink) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      {videoLink && (
        <iframe
          src={`${videoLink}`}
          width="100%"
          height="315"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full object-cover"
        ></iframe>
      )}
    </div>
  );
};

export default VideoPlayer;

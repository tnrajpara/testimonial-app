'use client'
import React, { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  link?: string;
  publicId?: string;
  cloudName?: string;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

const VideoPlayer = ({
  publicId,
  cloudName = "dihjks0ut", // your cloud name
  isExpanded = false,
  onToggleExpand
}: VideoPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateHeight = () => {
      if (iframeRef.current) {
        const width = iframeRef.current.offsetWidth;
        // 16:9 aspect ratio
        const height = (width * 9) / 16;
        setIframeHeight(height);
      }
    };

    // Initial calculation
    calculateHeight();
    setLoading(false);

    // Recalculate on window resize
    window.addEventListener('resize', calculateHeight);

    return () => {
      window.removeEventListener('resize', calculateHeight);
    };
  }, []);

  if (!publicId) {
    return <div className="w-full aspect-video bg-gray-100 animate-pulse rounded-lg" />;
  }

  const containerClasses = isExpanded
    ? "fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4"
    : "w-full relative aspect-video cursor-pointer hover:opacity-90 transition-opacity rounded-lg overflow-hidden";

  const iframeClasses = isExpanded
    ? "w-full max-w-6xl aspect-video"
    : "w-full h-full";

  return (
    <div className={containerClasses} onClick={onToggleExpand}>
      <div className={iframeClasses}>
        {loading && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg" />
        )}
        <iframe
          ref={iframeRef}
          className="w-full rounded-lg"
          style={{ height: iframeHeight || 'auto', aspectRatio: '16/9' }}
          src={`https://player.cloudinary.com/embed/?cloud_name=${cloudName}&public_id=${publicId}&player[fluid]=true&player[controls]=true&player[colors][base]=#ffffff&player[colors][accent]=#2563eb`}
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default VideoPlayer;

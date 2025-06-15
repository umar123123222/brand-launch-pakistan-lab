
import { useState } from "react";

interface YoutubeLiteProps {
  videoId: string;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
}

const YoutubeLite = ({ videoId, className, style, alt }: YoutubeLiteProps) => {
  const [activated, setActivated] = useState(false);
  const thumbnailURL = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  // The embed with ?autoplay=1 only loads after user click (good for Google Ads)
  return (
    <div
      className={`relative aspect-video w-full h-full cursor-pointer rounded-xl overflow-hidden bg-black border-2 border-yellow-400 shadow-lg ${className || ""}`}
      style={style}
    >
      {!activated ? (
        <button
          className="group absolute inset-0 w-full h-full flex items-center justify-center p-0 m-0 bg-black"
          style={{ outline: "none", border: 0 }}
          type="button"
          aria-label="Play video"
          onClick={() => setActivated(true)}
          tabIndex={0}
        >
          <img
            src={thumbnailURL}
            alt={alt || "YouTube video thumbnail"}
            className="object-cover w-full h-full block"
            width={896}
            height={504}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
          {/* Play button overlay */}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="bg-black/70 rounded-full p-4 group-hover:scale-110 transition-transform">
              <svg height="56" width="56" viewBox="0 0 56 56" aria-hidden="true">
                <circle cx="28" cy="28" r="28" fill="#FFCF56" fillOpacity="0.88" />
                <polygon points="23,18 41,28 23,38" fill="#000" />
              </svg>
            </span>
          </span>
        </button>
      ) : (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title="YouTube video player"
          frameBorder={0}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
};

export default YoutubeLite;

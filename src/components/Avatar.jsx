import { useState } from "react";

const Avatar = ({ src, name, className = "" }) => {
  const [failedSrc, setFailedSrc] = useState(null);

  const initial = name?.trim().charAt(0).toUpperCase() || "?";

  const combinedClassName = ["avatar", className].filter(Boolean).join(" ");

  const shouldShowImage = Boolean(src) && failedSrc !== src;

  if (shouldShowImage) {
    return (
      <img
        className={combinedClassName}
        src={src}
        alt={`${name || "Member"} avatar`}
        onError={() => setFailedSrc(src)}
      />
    );
  }

  return (
    <span
      className={`${combinedClassName} avatar-fallback`}
      aria-label={`${name || "Member"} avatar`}
    >
      {initial}
    </span>
  );
};

export default Avatar;

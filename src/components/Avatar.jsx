import { useEffect, useState } from "react";

const Avatar = ({
  src,
  name,
  className = "",
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [src]);

  const initial =
    name?.trim().charAt(0).toUpperCase() || "?";

  const combinedClassName = [
    "avatar",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (src && !imageFailed) {
    return (
      <img
        className={combinedClassName}
        src={src}
        alt={`${name || "Member"} avatar`}
        onError={() => setImageFailed(true)}
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
import React from "react";

interface AvatarProps {
  src: string;
  alt?: string;
  size?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  size = "w-10 h-10",
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-full object-cover ${size}`}
    />
  );
};

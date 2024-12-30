import React, { memo } from "react";

interface AvatarProps {
  src: string;
  alt?: string;
  size?: string;
  ariaLabel?: string
}

export const Avatar: React.FC<AvatarProps> = memo(({
  src,
  alt = 'Avatar',
  size = 'w-10 h-10',
  ariaLabel = '',
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-full object-cover ${size}`}
      aria-label={ariaLabel}
    />
  );
});

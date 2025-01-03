import React, { memo } from 'react';
import clsx from 'clsx';

interface AvatarProps {
  src: string;
  alt?: string;
  size?: string;
  ariaLabel?: string;
}

export const Avatar: React.FC<AvatarProps> = memo(({
  src,
  alt = 'Avatar',
  size = 'w-10 h-10',
  ariaLabel = '',
}) => {
  const validSizes = ['w-10 h-10', 'w-8 h-8', 'w-24 h-24', 'w-14 h-14'];

  return (
    <img
      src={src}
      alt={alt}
      className={clsx(
        'rounded-full object-cover',
        validSizes.includes(size) ? size : 'w-10 h-10'
      )}
      aria-label={ariaLabel}
    />
  );
});

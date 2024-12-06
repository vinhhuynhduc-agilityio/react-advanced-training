import { memo } from 'react';

interface FooterProps {
  content: string;
  backgroundColor?: string;
}

export const Footer = memo(
  ({ content, backgroundColor = 'bg-gradient-to-r from-gray-800 via-blue-900 to-gray-900' }: FooterProps) => (
    <footer
      className={`${backgroundColor} shrink-0 h-16 flex items-center justify-center`}
    >
      {content}
    </footer>
  )
);

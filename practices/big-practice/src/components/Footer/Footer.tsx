import { memo } from "react";

interface FooterProps {
  content: string;
};

const Footer = ({ content }: FooterProps) => (
  <footer className="bg-gradient-to-r from-gray-800 via-blue-900 to-gray-900 shrink-0 h-16 flex items-center justify-center">
    {content}
  </footer>
);

export default memo(Footer);

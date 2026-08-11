import React from 'react';

// Custom Vector SVG: Fig / Pear AYROVI Logo (شعار التين/الإجاصة البنفسجي)
export const FigLogoIcon: React.FC<{ className?: string; size?: number }> = ({ className = 'w-8 h-8', size }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Green Stem and Leaf on Top */}
    <path
      d="M48 24C48 15 54 10 57 8C55 13 52 17 48 24Z"
      fill="#48BB78"
    />
    <path
      d="M52 16C60 14 66 18 69 22C63 25 56 23 52 16Z"
      fill="#48BB78"
    />

    {/* Purple Fig Body */}
    <path
      d="M50 20C46 20 42 24 38 29C28 41 20 54 20 68C20 83 33 93 50 93C67 93 80 83 80 68C80 54 72 41 62 29C58 24 54 20 50 20Z"
      fill="#673DE6"
    />

    {/* White Inner Onion/Fig Slices */}
    {/* Outer Left Curve */}
    <path
      d="M32 70C32 58 39 44 48 32C41 42 36 55 36 70C36 78 40 84 46 88C37 84 32 78 32 70Z"
      fill="#FFFFFF"
    />
    {/* Outer Right Curve */}
    <path
      d="M68 70C68 58 61 44 52 32C59 42 64 55 64 70C64 78 60 84 54 88C63 84 68 78 68 70Z"
      fill="#FFFFFF"
    />
    {/* Inner Left Segment */}
    <path
      d="M44 76C44 64 47 50 50 40C47 48 45 61 45 76C45 82 47 86 50 89C46 87 44 82 44 76Z"
      fill="#FFFFFF"
    />
    {/* Inner Right Segment */}
    <path
      d="M56 76C56 64 53 50 50 40C53 48 55 61 55 76C55 82 53 86 50 89C54 87 56 82 56 76Z"
      fill="#FFFFFF"
    />
    {/* Center Vertical Core Line */}
    <line x1="50" y1="36" x2="50" y2="89" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Custom Vector SVG: Lens / Sparkles Box Icon (أيقونة Lens والنجوم المرفقة)
export const LensBoxIcon: React.FC<{ className?: string; size?: number }> = ({ className = 'w-6 h-6', size }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Rounded Open Framing Box with Cutouts */}
    <path
      d="M48 14H24C18.4772 14 14 18.4772 14 24V48M14 52V76C14 81.5228 18.4772 86 24 86H48M52 86H76C81.5228 86 86 81.5228 86 76V52M86 48V24C86 18.4772 81.5228 14 76 14H52"
      stroke="currentColor"
      strokeWidth="7"
      strokeLinecap="round"
    />

    {/* Primary 4-Point Star Sparkle */}
    <path
      d="M58 24C58 36 68 44 80 44C68 44 58 52 58 64C58 52 48 44 36 44C48 44 58 36 58 24Z"
      fill="currentColor"
    />

    {/* Secondary Smaller 4-Point Star Sparkle */}
    <path
      d="M34 54C34 60 40 65 46 65C40 65 34 70 34 76C34 70 28 65 22 65C28 65 34 60 34 54Z"
      fill="currentColor"
    />
  </svg>
);

// Custom Vector SVG: Modern Geometric AI Logo Icon (أيقونة AI المرفقة)
export const AiLogoIcon: React.FC<{ className?: string; size?: number }> = ({ className = 'w-6 h-6', size }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Dot above the 'i' */}
    <circle cx="53" cy="23" r="5" fill="currentColor" />

    {/* Left stroke of 'A' looping around to horizontal bar */}
    <path
      d="M43 32L21 72C19.5 74.5 21.5 78 24.5 78H55C58 78 60 75.5 60 72.5C60 69.5 58 67 55 67H36L48 44L56 60"
      stroke="currentColor"
      strokeWidth="8.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Right diagonal stroke of 'I' */}
    <path
      d="M57 33L77 73"
      stroke="currentColor"
      strokeWidth="8.5"
      strokeLinecap="round"
    />
  </svg>
);

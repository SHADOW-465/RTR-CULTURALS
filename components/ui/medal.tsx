import React from 'react';
import { cn } from '@/lib/utils';

interface MedalProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function Medal({ className, ...props }: MedalProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('w-12 h-12', className)}
      {...props}
    >
      <defs>
        <linearGradient id="medal-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#C0C0C0', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#A9A9A9', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"
        fill="url(#medal-gradient)"
        stroke="url(#medal-gradient)"
      />
      <path
        d="M12 12l3 3-3 3-3-3 3-3z"
        fill="url(#medal-gradient)"
        stroke="white"
        strokeWidth="0.5"
      />
    </svg>
  );
}

import React from 'react';
import { cn } from '@/lib/utils';

interface TrophyProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function Trophy({ className, ...props }: TrophyProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('w-16 h-16', className)}
      {...props}
    >
      <defs>
        <linearGradient id="trophy-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#FFA500', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill="url(#trophy-gradient)"
        stroke="url(#trophy-gradient)"
      />
      <path
        d="M6 21H18"
        stroke="url(#trophy-gradient)"
        strokeWidth="1.5"
      />
      <path
        d="M12 18V21"
        stroke="url(#trophy-gradient)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

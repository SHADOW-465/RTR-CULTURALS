"use client";

import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";

interface BorderBeamProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  colorFrom?: string;
  colorTo?: string;
  duration?: number;
  delay?: number;
}

export const BorderBeam = forwardRef<HTMLDivElement, BorderBeamProps>(
  (
    {
      className,
      colorFrom = "#ff0000",
      colorTo = "#ffc600",
      duration = 3,
      delay = 0,
      ...props
    },
    ref
  ) => {
    const [width, setWidth] = React.useState(0);
    const [height, setHeight] = React.useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const updateDimensions = () => {
        if (containerRef.current) {
          const { offsetWidth, offsetHeight } = containerRef.current;
          setWidth(offsetWidth);
          setHeight(offsetHeight);
        }
      };

      updateDimensions();
      window.addEventListener("resize", updateDimensions);

      return () => {
        window.removeEventListener("resize", updateDimensions);
      };
    }, []);

    return (
      <div
        ref={containerRef}
        style={
          {
            "--border-beam-color-from": colorFrom,
            "--border-beam-color-to": colorTo,
            "--border-beam-duration": `${duration}s`,
            "--border-beam-delay": `${delay}s`,
            "--border-beam-width": `${width}px`,
            "--border-beam-height": `${height}px`,
          } as React.CSSProperties
        }
        className={cn("relative", className)}
        {...props}
      >
        <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
          <div
            className="absolute h-[200%] w-[200%] animate-border-beam rounded-[inherit]"
            style={{
              top: `calc(50% - ${height}px)`,
              left: `calc(50% - ${width}px)`,
              backgroundImage: `conic-gradient(from 180deg at 50% 50%, transparent 0%, var(--border-beam-color-from) 50%, var(--border-beam-color-to) 100%, transparent 100%)`,
            }}
          />
        </div>
        <div className="relative z-10">{props.children}</div>
      </div>
    );
  }
);

BorderBeam.displayName = "BorderBeam";

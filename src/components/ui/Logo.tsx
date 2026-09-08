import React from "react";

interface LogoProps {
  className?: string;
  textClassName?: string;
  inverted?: boolean;
}

export function Logo({ className = "h-8", inverted = false }: LogoProps) {
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src={inverted ? "/logo-white.png" : "/logo-dark.png"}
        srcSet={inverted ? "/logo-white.png 1x, /logo-white@2x.png 2x" : "/logo-dark.png 1x, /logo-dark@2x.png 2x"}
        alt="StudyFam"
        className="h-full w-auto object-contain block"
        draggable={false}
      />
    </div>
  );
}

import { useId } from "react";

export default function LoadingDots({ size = 26, color = "#500088", className = "" }) {
  const id = useId();
  const dots = Array.from({ length: 8 });
  const radius = Math.max(size * 0.38, 8);
  const dotSize = Math.max(size * 0.14, 3);

  return (
    <span
      className={`sheearns-orbit-loader ${className}`.trim()}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        color,
      }}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      {dots.map((_, index) => (
        <span
          key={`${id}-${index}`}
          className="sheearns-orbit-dot"
          style={{
            width: `${dotSize}px`,
            height: `${dotSize}px`,
            transform: `rotate(${index * 45}deg) translate(0, -${radius}px)`,
            opacity: 0.25 + index * 0.09,
          }}
        />
      ))}
    </span>
  );
}

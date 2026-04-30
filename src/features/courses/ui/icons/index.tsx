import type { SVGProps } from "react";

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "width" | "height"> {
  size?: number | string;
}

const baseProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function applySize({ size = 16, ...rest }: IconProps) {
  return { ...baseProps, width: size, height: size, ...rest };
}

export function PlaceIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...applySize(props)}>
      <path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...applySize(props)}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function CompassIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...applySize(props)}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

export function CarIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...applySize(props)}>
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}

export function WalkIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...applySize(props)}>
      <circle cx="13" cy="4" r="2" />
      <path d="m9 21 3-7 1-2" />
      <path d="M12 12h5l-2-4" />
      <path d="m9 8 4-2" />
      <path d="m9 21 3-3" />
    </svg>
  );
}

export function SparklesIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...applySize(props)}>
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
      <path d="M5 3v4" />
      <path d="M3 5h4" />
      <path d="M19 17v4" />
      <path d="M17 19h4" />
    </svg>
  );
}

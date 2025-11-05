import type {
  CSSProperties,
  FocusEventHandler,
  MouseEventHandler,
  ReactElement,
  ReactNode,
} from "react";
import type { FeatureCollection } from "geojson";

export interface ComposableMapProps {
  projection?: string;
  projectionConfig?: Record<string, unknown>;
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function ComposableMap(props: ComposableMapProps): ReactElement;

export interface GeographiesChildArgs<TFeature = unknown> {
  geographies: TFeature[];
}

export interface GeographiesProps<TFeature = unknown> {
  geography: string | Record<string, unknown> | FeatureCollection;
  children: (args: GeographiesChildArgs<TFeature>) => ReactNode;
}

export function Geographies<TFeature = unknown>(
  props: GeographiesProps<TFeature>,
): ReactElement;

export interface GeographyInteractionHandlers {
  onClick?: MouseEventHandler<SVGPathElement>;
  onMouseEnter?: MouseEventHandler<SVGPathElement>;
  onMouseLeave?: MouseEventHandler<SVGPathElement>;
  onFocus?: FocusEventHandler<SVGPathElement>;
  onBlur?: FocusEventHandler<SVGPathElement>;
}

export interface GeographyProps extends GeographyInteractionHandlers {
  geography: unknown;
  stroke?: string;
  strokeWidth?: number;
  style?: {
    default?: CSSProperties;
    hover?: CSSProperties;
    pressed?: CSSProperties;
  };
  tabIndex?: number;
  "aria-label"?: string;
}

export function Geography(props: GeographyProps): ReactElement;

export interface MarkerProps extends GeographyInteractionHandlers {
  coordinates: [number, number];
  className?: string;
  children?: ReactNode;
}

export function Marker(props: MarkerProps): ReactElement;

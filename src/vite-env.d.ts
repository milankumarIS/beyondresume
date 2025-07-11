// src/vite-env.d.ts
/// <reference types="vite/client" />

declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      src?: string;
      alt?: string;
      style?: React.CSSProperties;
      'camera-orbit'?: string;
      'camera-target'?: string;
      'field-of-view'?: string;
      'min-camera-orbit'?: string;
      'max-camera-orbit'?: string;
      'render-mode'?: string;
      autoplay?: boolean;
      ar?: boolean;
      'auto-rotate'?: boolean;
      'camera-controls'?: boolean;
      exposure?: string;
      shadowIntensity?: string;
      [key: string]: any;
    };
  }
}



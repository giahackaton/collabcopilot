
/// <reference types="vite/client" />

// Declaración para el elemento personalizado de ElevenLabs
declare namespace JSX {
  interface IntrinsicElements {
    'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      'agent-id'?: string;
    }, HTMLElement>;
  }
}

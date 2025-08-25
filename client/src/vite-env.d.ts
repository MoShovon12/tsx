/// <reference types="vite/client" />

// Optional: type your environment variables used in the app
interface ImportMetaEnv {
  readonly VITE_API_URL?: string; // e.g. "https://your-proxy.example.com"
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

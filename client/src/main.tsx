// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";               // <- must be "./App", not "./features/Chat"
import "./index.css";

console.log("MAIN ACTIVE:", import.meta.url);

const root = document.getElementById("root");
if (!root) throw new Error("#root not found");
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);

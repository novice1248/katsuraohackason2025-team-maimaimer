import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.tsx"; // AuthProviderをインポート

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      {/* App全体をAuthProviderで囲む */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </StrictMode>,
  );
} else {
  console.error("Failed to find the root element");
}

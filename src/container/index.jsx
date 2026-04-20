import AppProviders from "./providers";
import AppRoutes from "@/routes";

/**
 * Application root shell (reference: `index.js` composes providers + `AppRoutes`).
 */
export default function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}

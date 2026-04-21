import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { publicLayoutRoutes, standaloneRoutes, pages } from "./config";

function RouteFallback() {
  return (
    <div className="page-shell">
      <div className="page-container flex min-h-[50vh] flex-col gap-4 py-10">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Top-level router (reference: `src/routes/index.js` owns `BrowserRouter` + `Routes`).
 */
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<PublicLayout />}>
            {publicLayoutRoutes.map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          </Route>
          {standaloneRoutes.map(({ path, Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
          <Route path="*" element={<pages.NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

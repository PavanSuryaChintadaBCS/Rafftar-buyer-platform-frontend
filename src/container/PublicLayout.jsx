import { Outlet } from "react-router-dom";
import Header from "@/components/Header";

/** Logged-in / marketplace shell (reference: `container` layout around routed children). */
export function PublicLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import AgriStackCallbackPage from ".";

export const Route = createFileRoute("/callback")({
  component: AgriStackCallbackPage,
});

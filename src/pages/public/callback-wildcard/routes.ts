import { createFileRoute } from "@tanstack/react-router";
import AgriStackCallbackWildcardPage from ".";

export const Route = createFileRoute("/callback/$callbackPath")({
  component: AgriStackCallbackWildcardPage,
});

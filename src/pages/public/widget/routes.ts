import { WidgetScreen } from "@/components/screens-component/widget";
import { createFileRoute } from "@tanstack/react-router";
import { createElement } from "react";

function WidgetRoute() {
	const { hostId } = Route.useParams();
	return createElement(WidgetScreen, { hostId });
}

export const Route = createFileRoute("/embed/$hostId")({
	component: WidgetRoute
});

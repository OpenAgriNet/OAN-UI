import { useAuthStore } from "@/hooks/store/auth";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_restrict-login-signup")({
	beforeLoad: () => {
		const { isAuthed } = useAuthStore.getState();

		if (isAuthed()) {
			throw redirect({ to: "/chat", replace: true });
		}
	},
	component: Outlet
});

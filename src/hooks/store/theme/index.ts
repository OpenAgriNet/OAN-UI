import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Theme, THEMES } from "@/components/screens-component/chat-screen/config";

interface ThemeStore {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
	persist(
		(set) => ({
			theme: THEMES.light,
			setTheme: (theme) => {
				set({ theme });
				applyTheme(theme);
			},
			toggleTheme: () => {
				set((state) => {
					const newTheme = state.theme === THEMES.light ? THEMES.dark : THEMES.light;
					applyTheme(newTheme);
					return { theme: newTheme };
				});
			}
		}),
		{
			name: "theme-storage"
		}
	)
);

function applyTheme(theme: Theme) {
	const root = window.document.documentElement;
	root.classList.remove(THEMES.light, THEMES.dark);
	root.classList.add(theme);
}

// Initial theme application. The light/dark selector was removed from the UI
// (AMUL-53), so the app is light-only: anyone whose browser still holds a
// persisted "dark" has no way to switch back, and we drop it here rather than
// leaving them stuck.
if (typeof window !== "undefined") {
	applyTheme(THEMES.light);
	if (localStorage.getItem("theme-storage")) {
		localStorage.removeItem("theme-storage");
	}
}

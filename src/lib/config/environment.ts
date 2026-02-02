export const environment = {
  /** API base URL; set at build time via VITE_API_BASE_URL (e.g. by CI). */
  apiUrl: (import.meta.env.VITE_API_BASE_URL as string) || 'https://dev-amulmitra.amul.com',
  maintenanceMode: false,
  guestUserLimit: 10,
};

export const environment = {
  /**
   * API base URL. Set via VITE_API_BASE_URL (env / .env / Docker build-arg).
   * No default — use .env for local dev and build args for prod so domains stay out of code.
   */
  apiUrl: (import.meta.env.VITE_API_BASE_URL as string) ?? '',
  maintenanceMode: false,
  guestUserLimit: 10,
};

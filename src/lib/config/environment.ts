export const environment = {
  apiUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  notificationApiUrl: import.meta.env.VITE_NOTIFICATION_API_URL || 'https://registry-sandbox-vistaar.da.gov.in/notification-api',
  maintenanceMode: false,
  guestUserLimit: 10,
  suggestionsDisabled: true,
  chatMessageMaxLength: 1000,
};

export const environment = {
  apiUrl: 'https://dev-vistaar.da.gov.in',
  notificationApiUrl: import.meta.env.VITE_NOTIFICATION_API_URL || 'https://registry-sandbox-vistaar.da.gov.in/notification-api',
  // notificationApiUrl:"http://localhost:8081",
  maintenanceMode: false,
  guestUserLimit: 10,
  suggestionsDisabled: true,
  chatMessageMaxLength: 1000,
};

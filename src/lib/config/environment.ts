export const environment = {
  apiUrl: '',
  notificationApiUrl: import.meta.env.VITE_NOTIFICATION_API_URL || 'https://registry-sandbox-vistaar.da.gov.in/notification-api',
  // notificationApiUrl:"http://localhost:8081",
  maintenanceMode: false,
  guestUserLimit: 10,
  suggestionsDisabled: true,
  chatMessageMaxLength: 1000,
};

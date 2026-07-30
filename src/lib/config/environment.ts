export const environment = {
  apiUrl: import.meta.env.VITE_API_BASE_URL || 'https://chat-vistaar.da.gov.in',
  notificationApiUrl: import.meta.env.VITE_NOTIFICATION_API_URL || 'https://registry-sandbox-vistaar.da.gov.in/notification-api',
  maintenanceMode: false,
  guestUserLimit: 10,
  suggestionsDisabled: true,
  chatMessageMaxLength: 1000,
};

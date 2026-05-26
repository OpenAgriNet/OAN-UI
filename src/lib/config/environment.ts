export const environment = {
  apiUrl: '',
  notificationApiUrl: import.meta.env.VITE_NOTIFICATION_API_URL || 'https://registry-sandbox-vistaar.da.gov.in/notification-api',
  maintenanceMode: false,
  guestUserLimit: 10,
  suggestionsDisabled: true,
  chatMessageMaxLength: 1000,
};

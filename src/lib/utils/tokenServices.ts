export const tokenService = {
  getAccessToken: () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    // Sync to legacy AuthContext storage
    try {
        const expiry = localStorage.getItem('accessTokenExpiresAt');
        const expiryTime = expiry ? Number(expiry) : new Date().getTime() + (365 * 24 * 60 * 60 * 1000);
        
        const tokenData = {
            token: accessToken,
            expiry: expiryTime
        };
        localStorage.setItem('auth_jwt', JSON.stringify(tokenData));
    } catch (e) {
        console.error("Failed to sync auth_jwt", e);
    }
  },
  clear: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessTokenExpiresAt');
    localStorage.removeItem('auth_jwt'); 
  },
  isAuthenticated: () => Boolean(localStorage.getItem('accessToken')),
  setExpiry: (expiresAt: number) => {
      localStorage.setItem('accessTokenExpiresAt', String(expiresAt));
      // Re-sync auth_jwt if token exists
      const token = localStorage.getItem('accessToken');
      if(token) {
          const tokenData = {
            token: token,
            expiry: expiresAt * 1000 // Convert unix seconds to ms for legacy context
          };
          localStorage.setItem('auth_jwt', JSON.stringify(tokenData));
      }
  },
  getExpiry: () => {
    const raw = localStorage.getItem('accessTokenExpiresAt');
    return raw ? Number(raw) : null;
  }
};

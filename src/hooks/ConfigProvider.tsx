import React, { createContext, useContext, useEffect } from "react";
import config from "../../config.json";

type Config = typeof config;

interface ConfigContextType {
  config: Config;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply Colors
    if (config.theme.colors) {
      Object.entries(config.theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    }
    
    // Apply Font Sizes
    if (config.theme.fontSizes) {
      Object.entries(config.theme.fontSizes).forEach(([key, value]) => {
        root.style.setProperty(`--font-size-${key}`, value);
      });
    }
    
    // Apply Font Family & URL
    if (config.theme.fonts) {
      root.style.setProperty('--font-family', config.theme.fonts.family);
      
      let link = document.getElementById('config-font') as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.id = 'config-font';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
      link.href = config.theme.fonts.url;
    }
  }, []);

  return (
    <ConfigContext.Provider value={{ config }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context.config;
};

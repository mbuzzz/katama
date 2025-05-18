
"use client";

import React, { useEffect, useCallback } from 'react';

const LOGO_STORAGE_KEY = 'katama-pos-custom-logo';

const DynamicFavicon: React.FC = () => {
  const updateFavicon = useCallback(() => {
    const customLogoUrl = localStorage.getItem(LOGO_STORAGE_KEY);
    let faviconLink = document.getElementById('dynamic-favicon') as HTMLLinkElement | null;

    const getMimeTypeFromDataUri = (dataUri: string | null): string => {
      if (dataUri && dataUri.startsWith('data:')) {
        const parts = dataUri.substring(5).split(';');
        if (parts.length > 0 && parts[0]) {
          return parts[0]; // e.g., "image/png" or "image/svg+xml"
        }
      }
      return 'image/png'; // A common, safe default if type cannot be determined from data URI
    };

    if (customLogoUrl) {
      if (!faviconLink) {
        faviconLink = document.createElement('link');
        faviconLink.id = 'dynamic-favicon';
        faviconLink.rel = 'icon';
        // Appending to head is generally fine. Browsers handle multiple icon links,
        // often prioritizing the last one or based on 'sizes' attribute (not used here for simplicity).
        document.head.appendChild(faviconLink);
      }
      faviconLink.type = getMimeTypeFromDataUri(customLogoUrl);
      faviconLink.href = customLogoUrl;
    } else {
      // If no custom logo, remove the dynamic favicon link if it exists.
      // This allows any default static favicon (e.g., /public/favicon.ico) to take effect.
      if (faviconLink) {
        document.head.removeChild(faviconLink);
      }
    }
  }, []);

  useEffect(() => {
    updateFavicon(); // Initial update on component mount

    // Listener for logo changes from within the same tab (e.g., settings page)
    const handleLogoChangedEvent = () => {
      updateFavicon();
    };
    
    // Listener for localStorage changes from other tabs/windows
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === LOGO_STORAGE_KEY) {
        updateFavicon();
      }
    };

    window.addEventListener('logoChanged', handleLogoChangedEvent);
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('logoChanged', handleLogoChangedEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [updateFavicon]);

  return null; // This component does not render any visible UI
};

export default DynamicFavicon;

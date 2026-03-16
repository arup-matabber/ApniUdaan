// PWA utilities for service worker registration and offline handling

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      console.log('Service Worker registered successfully:', registration);
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content is available, prompt user to refresh
            showUpdateAvailable();
          }
        });
      });
      
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

export const unregisterServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.unregister();
      console.log('Service Worker unregistered');
    }
  }
};

export const showUpdateAvailable = () => {
  // Create update notification
  const updateBanner = document.createElement('div');
  updateBanner.id = 'update-banner';
  updateBanner.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #3b82f6;
      color: white;
      padding: 1rem;
      text-align: center;
      z-index: 9999;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    ">
      <p style="margin: 0 0 0.5rem 0; font-weight: 600;">
        🎉 New version available!
      </p>
      <p style="margin: 0 0 1rem 0; font-size: 0.9rem;">
        Click refresh to get the latest features and improvements.
      </p>
      <button id="refresh-btn" style="
        background: white;
        color: #3b82f6;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        margin-right: 0.5rem;
      ">
        Refresh Now
      </button>
      <button id="dismiss-btn" style="
        background: transparent;
        color: white;
        border: 1px solid white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
      ">
        Later
      </button>
    </div>
  `;
  
  document.body.appendChild(updateBanner);
  
  // Handle refresh button
  document.getElementById('refresh-btn').addEventListener('click', () => {
    window.location.reload();
  });
  
  // Handle dismiss button
  document.getElementById('dismiss-btn').addEventListener('click', () => {
    updateBanner.remove();
  });
};

export const checkOnlineStatus = () => {
  const updateOnlineStatus = () => {
    const isOnline = navigator.onLine;
    
    // Remove existing status banner
    const existingBanner = document.getElementById('offline-banner');
    if (existingBanner) {
      existingBanner.remove();
    }
    
    if (!isOnline) {
      showOfflineBanner();
    }
  };
  
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  
  // Initial check
  updateOnlineStatus();
};

const showOfflineBanner = () => {
  const offlineBanner = document.createElement('div');
  offlineBanner.id = 'offline-banner';
  offlineBanner.innerHTML = `
    <div style="
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #f59e0b;
      color: white;
      padding: 1rem;
      text-align: center;
      z-index: 9999;
      box-shadow: 0 -2px 4px rgba(0,0,0,0.1);
    ">
      <p style="margin: 0; font-weight: 600;">
        📱 You're offline - Some features may be limited
      </p>
    </div>
  `;
  
  document.body.appendChild(offlineBanner);
};

export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

export const subscribeToPushNotifications = async (registration) => {
  if (!registration) return null;
  
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        // Replace with your VAPID public key
        'BEl62iUYgUivxIkv69yViEuiBIa40HI80NM9f4EmgHqFBMARBnJKVBXHiUxGcVFuQbunfFuFjyiuDqwG4aPXvLU'
      )
    });
    
    console.log('Push subscription:', subscription);
    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    return null;
  }
};

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const installPrompt = () => {
  let deferredPrompt;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show install button
    showInstallButton();
  });
  
  const showInstallButton = () => {
    // Only show if not already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return; // Already installed
    }
    
    const installButton = document.createElement('button');
    installButton.id = 'install-button';
    installButton.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #3b82f6;
        color: white;
        border: none;
        padding: 1rem;
        border-radius: 50px;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        cursor: pointer;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        transition: all 0.3s ease;
      " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
        📱 Install App
      </div>
    `;
    
    installButton.addEventListener('click', async () => {
      if (deferredPrompt) {
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        
        console.log(`User response to the install prompt: ${outcome}`);
        
        // Clear the deferredPrompt
        deferredPrompt = null;
        
        // Remove install button
        installButton.remove();
      }
    });
    
    document.body.appendChild(installButton);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (document.getElementById('install-button')) {
        installButton.remove();
      }
    }, 10000);
  };
};

export const trackPWAUsage = () => {
  // Track if app is running as PWA
  const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                window.navigator.standalone === true;
  
  if (isPWA) {
    console.log('App is running as PWA');
    // You can send analytics here
  }
  
  // Track app install
  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    // You can send analytics here
  });
};

export const initializePWA = async () => {
  try {
    // Register service worker
    const registration = await registerServiceWorker();
    
    // Check online status
    checkOnlineStatus();
    
    // Setup install prompt
    installPrompt();
    
    // Track PWA usage
    trackPWAUsage();
    
    // Request notification permission (optional)
    const notificationPermission = await requestNotificationPermission();
    if (notificationPermission && registration) {
      await subscribeToPushNotifications(registration);
    }
    
    console.log('PWA initialized successfully');
    return true;
  } catch (error) {
    console.error('PWA initialization failed:', error);
    return false;
  }
};

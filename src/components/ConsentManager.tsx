"use client";
import { useState, useEffect } from "react";
import { Shield, CheckCircle, XCircle, Settings, Cookie } from "lucide-react";

interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}


export default function ConsentManager() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem('killsub-consent');
    if (!consent) {
      setShowBanner(true);
    } else {
      const savedPreferences = JSON.parse(consent);
      setPreferences(savedPreferences);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem('killsub-consent', JSON.stringify(allAccepted));
    setShowBanner(false);
    setShowSettings(false);
    
    // Trigger analytics if accepted
    if (typeof window !== 'undefined' && window.gtag) {
      (window.gtag as any)('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
        functionality_storage: 'granted',
      });
    }
  };

  const handleRejectAll = () => {
    const minimalConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    setPreferences(minimalConsent);
    localStorage.setItem('killsub-consent', JSON.stringify(minimalConsent));
    setShowBanner(false);
    setShowSettings(false);
    
    // Disable analytics
    if (typeof window !== 'undefined' && window.gtag) {
      (window.gtag as any)('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        functionality_storage: 'denied',
      });
    }
  };

  const handleSavePreferences = () => {
    localStorage.setItem('killsub-consent', JSON.stringify(preferences));
    setShowBanner(false);
    setShowSettings(false);
    
    // Update Google Analytics consent
    if (typeof window !== 'undefined' && window.gtag) {
      (window.gtag as any)('consent', 'update', {
        analytics_storage: preferences.analytics ? 'granted' : 'denied',
        ad_storage: preferences.marketing ? 'granted' : 'denied',
        functionality_storage: preferences.functional ? 'granted' : 'denied',
      });
    }
  };

  const togglePreference = (key: keyof ConsentPreferences) => {
    if (key === 'necessary') return; // Cannot disable necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!showBanner && !showSettings) {
    return (
      <button
        onClick={() => setShowSettings(true)}
        className="fixed bottom-4 right-4 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors z-50"
        title="Cookie Settings"
      >
        <Cookie className="w-5 h-5" />
      </button>
    );
  }

  return (
    <>
      {/* Cookie Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-6 z-50">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  We value your privacy
                </h3>
                <p className="text-muted text-sm mb-4">
                  We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts. 
                  You can customize your preferences or accept all cookies.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAcceptAll}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={() => {
                      setShowBanner(false);
                      setShowSettings(true);
                    }}
                    className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    Customize
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Cookie Preferences</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-muted hover:text-foreground transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Necessary Cookies */}
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">Necessary Cookies</h3>
                    <p className="text-sm text-muted">Required for the website to function properly</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-muted">Always Active</span>
                  </div>
                </div>
                <p className="text-xs text-muted">
                  These cookies are essential for the website to function and cannot be switched off. 
                  They include authentication, security, and basic functionality cookies.
                </p>
              </div>

              {/* Analytics Cookies */}
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">Analytics Cookies</h3>
                    <p className="text-sm text-muted">Help us understand how visitors interact with our website</p>
                  </div>
                  <button
                    onClick={() => togglePreference('analytics')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.analytics ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.analytics ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-muted">
                  These cookies collect information about how you use our website, such as which pages you visit most often. 
                  This helps us improve our website and provide better user experience.
                </p>
              </div>

              {/* Functional Cookies */}
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">Functional Cookies</h3>
                    <p className="text-sm text-muted">Enable enhanced functionality and personalization</p>
                  </div>
                  <button
                    onClick={() => togglePreference('functional')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.functional ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.functional ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-muted">
                  These cookies enable enhanced functionality and personalization, such as remembering your preferences 
                  and settings to provide a more personalized experience.
                </p>
              </div>

              {/* Marketing Cookies */}
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">Marketing Cookies</h3>
                    <p className="text-sm text-muted">Used to deliver relevant advertisements and track campaign performance</p>
                  </div>
                  <button
                    onClick={() => togglePreference('marketing')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.marketing ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.marketing ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-muted">
                  These cookies are used to deliver advertisements more relevant to you and your interests. 
                  They may also be used to limit the number of times you see an advertisement and measure campaign effectiveness.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={handleSavePreferences}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Save Preferences
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex-1 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

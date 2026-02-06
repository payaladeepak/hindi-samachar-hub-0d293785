import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

function detectDevice(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return 'Mobile';
  if (/tablet|ipad/i.test(userAgent)) return 'Tablet';
  return 'Desktop';
}

function detectBrowser(userAgent: string): string {
  if (/chrome/i.test(userAgent) && !/edge/i.test(userAgent)) return 'Chrome';
  if (/firefox/i.test(userAgent)) return 'Firefox';
  if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return 'Safari';
  if (/edge/i.test(userAgent)) return 'Edge';
  if (/opera|opr/i.test(userAgent)) return 'Opera';
  return 'Unknown';
}

export function useVisitorTracking() {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        const userAgent = navigator.userAgent;
        const sessionKey = `visited_${location.pathname}`;
        
        // Only track once per session per page
        if (sessionStorage.getItem(sessionKey)) return;
        
        // Get IP address from external service
        let ipAddress = null;
        try {
          const ipResponse = await fetch('https://api.ipify.org?format=json');
          const ipData = await ipResponse.json();
          ipAddress = ipData.ip;
        } catch {
          console.log('Could not fetch IP address');
        }

        const visitorData = {
          ip_address: ipAddress,
          user_id: user?.id || null,
          visitor_name: user?.email?.split('@')[0] || null,
          user_agent: userAgent,
          page_visited: location.pathname,
          referrer: document.referrer || null,
          device_type: detectDevice(userAgent),
          browser: detectBrowser(userAgent),
        };

        const { error } = await supabase
          .from('visitor_data')
          .insert(visitorData);

        if (!error) {
          sessionStorage.setItem(sessionKey, 'true');
        }
      } catch (error) {
        console.error('Error tracking visitor:', error);
      }
    };

    trackVisit();
  }, [location.pathname, user?.id, user?.email]);
}

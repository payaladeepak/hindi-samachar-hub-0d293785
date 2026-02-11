import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

interface SEOSettings {
  site_name: string;
  site_description: string;
  default_keywords: string;
  google_verification: string;
  bing_verification: string;
  google_analytics_id: string;
}

const defaultSettings: SEOSettings = {
  site_name: 'ताज़ा खबर',
  site_description: 'भारत की सबसे विश्वसनीय हिंदी समाचार वेबसाइट',
  default_keywords: 'हिंदी समाचार, ताज़ा खबर, भारत समाचार',
  google_verification: '',
  bing_verification: '',
  google_analytics_id: '',
};

export function useSEOSettings() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['seo-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seo_settings')
        .select('setting_key, setting_value');
      
      if (error) throw error;
      
      const settingsMap: SEOSettings = { ...defaultSettings };
      data?.forEach((item) => {
        const key = item.setting_key as keyof SEOSettings;
        if (key in settingsMap) {
          settingsMap[key] = item.setting_value || '';
        }
      });
      
      return settingsMap;
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<SEOSettings>) => {
      const updates = Object.entries(newSettings).map(([key, value]) => 
        supabase
          .from('seo_settings')
          .upsert({ setting_key: key, setting_value: value }, { onConflict: 'setting_key' })
      );
      
      const results = await Promise.all(updates);
      const errors = results.filter(r => r.error);
      if (errors.length > 0) {
        throw errors[0].error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-settings'] });
    },
  });

  return {
    settings: settings || defaultSettings,
    isLoading,
    updateSettings,
  };
}

// Hook to apply SEO meta tags and Google Analytics
export function useApplySEO() {
  const { settings } = useSEOSettings();

  useEffect(() => {
    // Apply Google Site Verification
    if (settings.google_verification) {
      let metaTag = document.querySelector('meta[name="google-site-verification"]');
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', 'google-site-verification');
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', settings.google_verification);
    }

    // Apply Bing Verification
    if (settings.bing_verification) {
      let metaTag = document.querySelector('meta[name="msvalidate.01"]');
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', 'msvalidate.01');
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', settings.bing_verification);
    }

    // Apply Google Analytics
    if (settings.google_analytics_id) {
      const gaId = settings.google_analytics_id;
      
      // Check if already loaded
      if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${gaId}"]`)) {
        // Load gtag.js
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script);

        // Initialize gtag
        const inlineScript = document.createElement('script');
        inlineScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `;
        document.head.appendChild(inlineScript);
      }
    }
  }, [settings]);
}

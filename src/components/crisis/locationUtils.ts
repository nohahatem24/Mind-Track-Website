/**
 * Location Detection Utilities
 * Detect user's location via Geolocation API, IP lookup, or manual selection
 */

import { countryResources, detectCountryFromTimezone } from './crisisResourcesData';

export interface LocationDetectionResult {
  countryCode: string | null;
  country: string | null;
  method: 'geolocation' | 'timezone' | 'ip' | 'manual' | 'stored';
  confidence: 'high' | 'medium' | 'low';
}

// Storage key for user's location preference
const LOCATION_STORAGE_KEY = 'crisis_resources_location';

/**
 * Get stored location preference from localStorage
 */
export const getStoredLocation = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(LOCATION_STORAGE_KEY);
  } catch {
    return null;
  }
};

/**
 * Save location preference to localStorage
 */
export const saveLocationPreference = (countryCode: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCATION_STORAGE_KEY, countryCode);
  } catch {
    console.warn('Failed to save location preference');
  }
};

/**
 * Clear stored location preference
 */
export const clearLocationPreference = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(LOCATION_STORAGE_KEY);
  } catch {
    console.warn('Failed to clear location preference');
  }
};

/**
 * Reverse geocode coordinates to country code using free service
 */
const reverseGeocodeCoordinates = async (lat: number, lon: number): Promise<string | null> => {
  try {
    // Using Nominatim (OpenStreetMap) - free, no API key needed
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
      headers: {
        'User-Agent': 'MindTrack-App',
      },
    });

    if (!response.ok) return null;

    const data = await response.json();

    // Map country names to country codes
    const countryName = data.address?.country || '';
    const countryCode = getCountryCodeFromName(countryName);
    return countryCode;
  } catch (error) {
    console.warn('Reverse geocoding failed:', error);
    return null;
  }
};

/**
 * Get country code from country name
 */
const getCountryCodeFromName = (countryName: string): string | null => {
  const nameMap: Record<string, string> = {
    'United States': 'US',
    'United Kingdom': 'GB',
    'Canada': 'CA',
    'Australia': 'AU',
    'New Zealand': 'NZ',
    'Germany': 'DE',
    'France': 'FR',
    'Italy': 'IT',
    'Spain': 'ES',
    'Netherlands': 'NL',
    'Belgium': 'BE',
    'Sweden': 'SE',
    'Norway': 'NO',
    'Denmark': 'DK',
    'Finland': 'FI',
    'Poland': 'PL',
    'Greece': 'GR',
    'Portugal': 'PT',
    'Ireland': 'IE',
    'Switzerland': 'CH',
    'Austria': 'AT',
    'Egypt': 'EG',
    'Saudi Arabia': 'SA',
    'United Arab Emirates': 'AE',
    'Jordan': 'JO',
    'Lebanon': 'LB',
    'Israel': 'IL',
    'India': 'IN',
    'Japan': 'JP',
    'South Korea': 'KR',
    'Singapore': 'SG',
    'Mexico': 'MX',
    'Brazil': 'BR',
    'Argentina': 'AR',
    'Chile': 'CL',
  };

  return nameMap[countryName] || null;
};

/**
 * Try to get country code using IP-based geolocation
 * Falls back to multiple free services
 */
const detectCountryFromIP = async (): Promise<string | null> => {
  const ipServices = [
    {
      url: 'https://ipapi.co/json/',
      parse: (data: any) => data.country_code,
    },
    {
      url: 'https://ip-api.com/json/',
      parse: (data: any) => data.countryCode,
    },
    {
      url: 'https://ipwho.is/',
      parse: (data: any) => data.country_code,
    },
  ];

  for (const service of ipServices) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(service.url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'MindTrack-App' },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const countryCode = service.parse(data);
        if (countryCode && countryCode in countryResources) {
          return countryCode;
        }
      }
    } catch (error) {
      // Continue to next service on error
      continue;
    }
  }

  return null;
};

/**
 * Main location detection function
 * Tries multiple methods in order of preference
 */
export const detectUserLocation = async (): Promise<LocationDetectionResult> => {
  // 1. Check if location is already stored
  const storedLocation = getStoredLocation();
  if (storedLocation && storedLocation in countryResources) {
    return {
      countryCode: storedLocation,
      country: countryResources[storedLocation].country,
      method: 'stored',
      confidence: 'high',
    };
  }

  // 2. Try Geolocation API (highest confidence)
  if (navigator.geolocation) {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
          enableHighAccuracy: false,
        });
      });

      const { latitude, longitude } = position.coords;
      const countryCode = await reverseGeocodeCoordinates(latitude, longitude);

      if (countryCode && countryCode in countryResources) {
        return {
          countryCode,
          country: countryResources[countryCode].country,
          method: 'geolocation',
          confidence: 'high',
        };
      }
    } catch (error) {
      console.warn('Geolocation failed:', error);
    }
  }

  // 3. Try timezone detection (medium confidence)
  const timezoneCountryCode = detectCountryFromTimezone();
  if (timezoneCountryCode && timezoneCountryCode in countryResources) {
    return {
      countryCode: timezoneCountryCode,
      country: countryResources[timezoneCountryCode].country,
      method: 'timezone',
      confidence: 'medium',
    };
  }

  // 4. Try IP-based detection (lower confidence)
  const ipCountryCode = await detectCountryFromIP();
  if (ipCountryCode && ipCountryCode in countryResources) {
    return {
      countryCode: ipCountryCode,
      country: countryResources[ipCountryCode].country,
      method: 'ip',
      confidence: 'medium',
    };
  }

  // 5. Return null if no location detected
  return {
    countryCode: null,
    country: null,
    method: 'manual',
    confidence: 'low',
  };
};

/**
 * Request user permission for geolocation
 */
export const requestGeolocationPermission = async (): Promise<boolean> => {
  if (!navigator.geolocation) {
    return false;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      () => resolve(true),
      () => resolve(false),
      { timeout: 5000 }
    );
  });
};

/**
 * Check if a country code is valid
 */
export const isValidCountryCode = (code: string): code is keyof typeof countryResources => {
  return code in countryResources;
};

/**
 * Get country code from full country name
 */
export const getCountryCodeByName = (countryName: string): string | null => {
  const entry = Object.entries(countryResources).find(
    ([_, resource]) => resource.country.toLowerCase() === countryName.toLowerCase()
  );
  return entry ? entry[0] : null;
};

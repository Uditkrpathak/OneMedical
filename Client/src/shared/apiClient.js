import { API_BASE_URL } from './config';
import { getDevModeOverride } from './hooks/useNetworkStatus';
import { offlineSyncService } from './services/offlineSyncService';

/**
 * Production-grade Resilient API Fetcher
 * Attempts live gateway request, falls back to rich mock data if endpoint is unreachable or 503,
 * and queues write operations if network is offline.
 *
 * @param {string} endpoint e.g. '/appointments' or '/clinical/programs/active'
 * @param {object} options fetch options (method, headers, body)
 * @param {function} mockFallbackFn function returning realistic mock data
 * @returns {Promise<{ success: boolean, data: any, source: 'live' | 'mock' | 'queued', error?: string }>}
 */
export const resilientFetch = async (endpoint, options = {}, mockFallbackFn = () => null) => {
  const method = (options.method || 'GET').toUpperCase();
  const devOverride = getDevModeOverride();

  // If developer forced Mock Mode, bypass live network call
  if (devOverride === 'mock') {
    console.log(`[API Client] [Dev Override MOCK] ${method} ${endpoint}`);
    if (method !== 'GET') {
      const queued = await offlineSyncService.queueMutation(endpoint, method, options.body ? JSON.parse(options.body) : {});
      return { success: true, data: queued, source: 'queued', isOfflineQueued: true };
    }
    return { success: true, data: mockFallbackFn(), source: 'mock' };
  }

  try {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    const controller = new AbortController();
    const timeoutMs = options.timeout || 6000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    console.log(`[API Client] Requesting Live: ${method} ${url}`);
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    // If API Gateway returns 503 or fallback header, trigger resilient fallback
    const isFallbackAllowed = response.headers.get('x-fallback-allowed') === 'true' || response.status === 503;

    if (response.ok) {
      const json = await response.json();
      const payload = json.data !== undefined ? json.data : json;
      return { success: true, data: payload, source: 'live' };
    }

    if (isFallbackAllowed || response.status === 404 || response.status >= 500) {
      console.warn(`[API Client] Live endpoint [${response.status}] ${endpoint} -> Falling back to Mock Data`);
      if (method !== 'GET') {
        const bodyObj = options.body ? (typeof options.body === 'string' ? JSON.parse(options.body) : options.body) : {};
        const queued = await offlineSyncService.queueMutation(endpoint, method, bodyObj);
        return { success: true, data: mockFallbackFn() || queued, source: 'queued', isOfflineQueued: true };
      }
      return { success: true, data: mockFallbackFn(), source: 'mock' };
    }

    // Standard client error (400, 401, 403)
    const errJson = await response.json().catch(() => ({}));
    return {
      success: false,
      error: errJson.error?.message || errJson.message || `HTTP ${response.status} Error`,
      source: 'live',
    };
  } catch (error) {
    console.warn(`[API Client] Connection error on ${method} ${endpoint}: ${error.message}. Triggering Fallback.`);

    // If write mutation fails due to offline/network, queue mutation locally
    if (method !== 'GET') {
      try {
        const bodyObj = options.body ? (typeof options.body === 'string' ? JSON.parse(options.body) : options.body) : {};
        const queued = await offlineSyncService.queueMutation(endpoint, method, bodyObj);
        return {
          success: true,
          data: mockFallbackFn() || queued,
          source: 'queued',
          isOfflineQueued: true,
          message: 'Saved locally. Will sync automatically when connection returns.',
        };
      } catch (queueErr) {
        console.error('[API Client] Queueing failed:', queueErr);
      }
    }

    return {
      success: true,
      data: mockFallbackFn(),
      source: 'mock',
      isFallback: true,
    };
  }
};

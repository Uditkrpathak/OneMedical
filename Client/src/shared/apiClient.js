import { API_BASE_URL } from './config';
import { offlineSyncService } from './services/offlineSyncService';

/**
 * Production-grade Live API Fetcher
 * Sends live requests to API Gateway / Microservices. Returns real data or real errors.
 * Queues write mutations if offline.
 *
 * @param {string} endpoint e.g. '/appointments' or '/clinical/programs/active'
 * @param {object} options fetch options (method, headers, body)
 * @returns {Promise<{ success: boolean, data: any, source: 'live' | 'queued', error?: string }>}
 */
export const resilientFetch = async (endpoint, options = {}) => {
  const method = (options.method || 'GET').toUpperCase();

  try {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    const controller = new AbortController();
    const timeoutMs = options.timeout || 10000;
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

    if (response.ok) {
      const json = await response.json();
      const payload = json.data !== undefined ? json.data : json;
      return { success: true, data: payload, source: 'live' };
    }

    // Standard API error handling (400, 401, 403, 404, 500)
    const errJson = await response.json().catch(() => ({}));
    const errorMessage = errJson.error?.message || errJson.message || `HTTP ${response.status} Error`;
    console.error(`[API Client] Error on ${method} ${endpoint}: ${errorMessage}`);
    return {
      success: false,
      error: errorMessage,
      source: 'live',
    };
  } catch (error) {
    console.error(`[API Client] Live connection error on ${method} ${endpoint}: ${error.message}`);

    // If write mutation fails due to offline/network, queue mutation locally
    if (method !== 'GET') {
      try {
        const bodyObj = options.body ? (typeof options.body === 'string' ? JSON.parse(options.body) : options.body) : {};
        const queued = await offlineSyncService.queueMutation(endpoint, method, bodyObj);
        return {
          success: true,
          data: queued,
          source: 'queued',
          isOfflineQueued: true,
          message: 'Saved locally. Will sync automatically when connection returns.',
        };
      } catch (queueErr) {
        console.error('[API Client] Queueing failed:', queueErr);
      }
    }

    return {
      success: false,
      error: `Network Error: ${error.message || 'Unable to connect to server.'}`,
      source: 'live',
    };
  }
};

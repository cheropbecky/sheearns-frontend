const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://127.0.0.1:8000";

const GET_CACHE_TTL_MS = 60 * 1000;
const getCache = new Map();
const inFlightGetRequests = new Map();

function extractErrorMessage(payload) {
  if (!payload) {
    return "Request failed";
  }

  if (typeof payload?.detail === "string" && payload.detail.trim()) {
    return payload.detail;
  }

  if (Array.isArray(payload?.detail)) {
    const details = payload.detail
      .map((item) => item?.msg || item?.message)
      .filter(Boolean)
      .join(" ");
    if (details) {
      return details;
    }
  }

  if (typeof payload?.message === "string" && payload.message.trim()) {
    return payload.message;
  }

  return "Request failed";
}

function buildUrl(path) {
  if (!path.startsWith("/")) {
    return `${API_BASE_URL}/${path}`;
  }
  return `${API_BASE_URL}${path}`;
}

function hasContentTypeHeader(headers) {
  return Object.keys(headers || {}).some((key) => key.toLowerCase() === "content-type");
}

function getCacheKey(url, method, authToken) {
  return `${method}:${url}:${authToken || "anonymous"}`;
}

async function apiRequest(path, options = {}) {
  const { disableCache = false, ...fetchOptions } = options;
  let authHeader = {};
  let authToken = "";
  try {
    const savedUser = localStorage.getItem("sheearns_user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed?.token) {
        authToken = parsed.token;
        authHeader = { Authorization: `Bearer ${parsed.token}` };
      }
    }
  } catch {
    authHeader = {};
    authToken = "";
  }

  const method = String(fetchOptions.method || "GET").toUpperCase();
  const url = buildUrl(path);
  const headers = {
    ...authHeader,
    ...(fetchOptions.headers || {}),
  };

  if (fetchOptions.body && !hasContentTypeHeader(headers)) {
    headers["Content-Type"] = "application/json";
  }

  const isCacheableGet = method === "GET" && !fetchOptions.body && !disableCache;
  const cacheKey = getCacheKey(url, method, authToken);

  if (isCacheableGet) {
    const cached = getCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.payload;
    }

    if (inFlightGetRequests.has(cacheKey)) {
      return inFlightGetRequests.get(cacheKey);
    }
  }

  const requestPromise = (async () => {
    const response = await fetch(url, {
      ...fetchOptions,
      method,
      headers,
    });

    let payload = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    if (!response.ok) {
      const message = extractErrorMessage(payload);
      throw new Error(message);
    }

    if (isCacheableGet) {
      getCache.set(cacheKey, {
        payload,
        expiresAt: Date.now() + GET_CACHE_TTL_MS,
      });
    }

    return payload;
  })();

  if (isCacheableGet) {
    inFlightGetRequests.set(cacheKey, requestPromise);
    try {
      return await requestPromise;
    } finally {
      inFlightGetRequests.delete(cacheKey);
    }
  }

  return requestPromise;
}

export { API_BASE_URL, buildUrl, apiRequest };
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const client = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 60000, // 60s — Gemini calls can be slow
});

// Retry a request up to maxRetries times with exponential backoff.
// Only retries on connection-refused / network errors (no response from server).
const MAX_RETRIES = 4;
const RETRY_BASE_MS = 1500;

async function withRetry(requestFn, retries = MAX_RETRIES) {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            return await requestFn();
        } catch (err) {
            const isNetworkError = !err.response && (
                err.code === 'ERR_NETWORK' ||
                err.code === 'ECONNREFUSED' ||
                err.message === 'Network Error'
            );

            if (isNetworkError && attempt < retries) {
                const delay = RETRY_BASE_MS * Math.pow(2, attempt); // 1.5s, 3s, 6s, 12s
                console.warn(`[client] Connection refused — retrying in ${delay}ms (attempt ${attempt + 1}/${retries})`);
                await new Promise(res => setTimeout(res, delay));
            } else {
                throw err;
            }
        }
    }
}

// Patch all HTTP methods to use the retry wrapper
const _client = {
    get: (url, config) => withRetry(() => client.get(url, config)),
    post: (url, data, config) => withRetry(() => client.post(url, data, config)),
    patch: (url, data, config) => withRetry(() => client.patch(url, data, config)),
    put: (url, data, config) => withRetry(() => client.put(url, data, config)),
    delete: (url, config) => withRetry(() => client.delete(url, config)),
};

client.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data);
        } else {
            console.error('API Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export { _client as default, withRetry };
export { client as rawClient };

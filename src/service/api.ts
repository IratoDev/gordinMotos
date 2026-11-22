import axios from "axios";
import { getToken, getRefreshToken, setSession, removeTokens } from "../lib/cookie";

export function setupApiClient() {


  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error.config;

      if (error.response?.status === 401 && !original._retry) {
        original._retry = true;
        const refreshToken = getRefreshToken();

        if (refreshToken) {
          try {
           
            const { data } = await axios.post(
              `${api.defaults.baseURL}/auth/client/refresh`,
              { refreshToken }
            );
            setSession(data.acessToken, data.refreshToken);
            original.headers.Authorization = `Bearer ${data.acessToken}`;
            return api(original); 
          } catch {
            removeTokens();
          }
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
}
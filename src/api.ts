import axios from "axios";

import {supabase} from "./supabaseClient";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

apiClient.interceptors.request.use(async (config) => {
  const {data: {session}} = await supabase.auth.getSession();
  console.log("Token enviado:", session?.access_token);

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;

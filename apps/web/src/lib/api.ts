import axios, { type AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    console.log(`${response.config.url}: `, response.data);
    return response;
  },
  async (error: AxiosError & { config: AxiosError['config'] & { _retry?: boolean; }}) => {
    const originalReponse = error.config;
    const response = error.response;
    if(!originalReponse || originalReponse._retry || !response || response.status !== 401 || originalReponse.url?.includes('/auth/refresh')){
      return Promise.reject(error);
    }
    try{

      const refresh = await api.post<{accessToken: string}>('/auth/refresh');
      const accessToken = `Bearer ${refresh.data.accessToken}`;
      api.defaults.headers.common.Authorization = accessToken;
      originalReponse.headers.Authorization = accessToken;
      originalReponse._retry = true;

      return api(originalReponse);
    }catch(e){
      return Promise.reject(e);
    }
  
  }
);

export default api;

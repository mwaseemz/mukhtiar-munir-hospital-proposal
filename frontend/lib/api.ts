import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retried, try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
                refreshToken,
              });

              const { accessToken } = response.data.data;
              localStorage.setItem('accessToken', accessToken);

              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, logout user
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }
}

export const api = new ApiClient();

// API Endpoints
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (data: any) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    api.post('/auth/change-password', data),
};

export const patientApi = {
  getAll: () => api.get('/patients'),
  create: (data: any) => api.post('/patients', data),
  getById: (id: string) => api.get(`/patients/${id}`),
  getByMR: (mrNumber: string) => api.get(`/patients/mr/${mrNumber}`),
  update: (id: string, data: any) => api.put(`/patients/${id}`, data),
  delete: (id: string) => api.delete(`/patients/${id}`),
  search: (params: any) => api.get('/patients/search', { params }),
  getDetails: (id: string) => api.get(`/patients/${id}/details`),
  discharge: (id: string, data: any) => api.post(`/patients/${id}/discharge`, data),
  getStats: () => api.get('/patients/stats'),
};

export const consentFormApi = {
  create: (data: any) => api.post('/consent-forms', data),
  getById: (id: string) => api.get(`/consent-forms/${id}`),
  getByPatient: (patientId: string) => api.get(`/consent-forms/patient/${patientId}`),
  update: (id: string, data: any) => api.put(`/consent-forms/${id}`, data),
  complete: (id: string, data: any) => api.post(`/consent-forms/${id}/complete`, data),
  checkRequired: (patientId: string) => api.get(`/consent-forms/patient/${patientId}/check`),
  uploadDocument: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/consent-forms/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const signatureApi = {
  create: (data: any) => api.post('/signatures', data),
  getById: (id: string) => api.get(`/signatures/${id}`),
  getMy: () => api.get('/signatures/my-signatures'),
  getDefault: () => api.get('/signatures/default'),
  setDefault: (id: string) => api.put(`/signatures/${id}/set-default`),
  delete: (id: string) => api.delete(`/signatures/${id}`),
  getStyles: () => api.get('/signatures/styles'),
};

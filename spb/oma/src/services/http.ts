import axios, {
  Axios, AxiosError, AxiosHeaders, AxiosResponse, HttpStatusCode, InternalAxiosRequestConfig
} from 'axios';
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import ConcurrencyHandler from '@/helpers/concurrency';
import { ResponseError } from '@/helpers/error';
import i18next from '@/helpers/i18n';
import { logError } from '@/helpers/logger';
import { getData } from '@/helpers/storage';
import { toastError } from '@/helpers/toast';
import authService from '@/services/auth.service';
import { API_URL } from '@env';

class AxiosConfig {
  private axiosInstance: Axios;
  private concurrencyHandler: ConcurrencyHandler;
  private isProtected: boolean = false;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_URL,
      headers: this.defaultHeaders(),
    });

    this.concurrencyHandler = ConcurrencyHandler.getInstance();

    // Bind methods to preserve 'this' context
    this.onRequest = this.onRequest.bind(this);
    this.onResponse = this.onResponse.bind(this);
    this.onErrorResponse = this.onErrorResponse.bind(this);
    this.onGuestErrorResponse = this.onGuestErrorResponse.bind(this);
  }

  public guessAxios(): Axios {
    this.axiosInstance.interceptors.request.use(this.onRequest);
    this.axiosInstance.interceptors.response.use(
      this.onResponse,
      this.onGuestErrorResponse
    );

    return this.axiosInstance;
  }

  public protectedAxios(): Axios {
    this.isProtected = true;
    this.axiosInstance.interceptors.request.use(this.onRequest);
    this.axiosInstance.interceptors.response.use(
      this.onResponse,
      this.onErrorResponse
    );

    return this.axiosInstance;
  }

  private async onRequest(
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> {
    if (this.isProtected) {
      const token = await getData('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (
      config.data &&
      typeof config.data === 'object' &&
      typeof config.headers['Content-Type'] === 'string' &&
      config.headers['Content-Type']?.includes('application/json')
    ) {
      config.data = snakecaseKeys(config.data, { deep: true });
    }

    return config;
  }

  private onResponse(response: AxiosResponse): AxiosResponse {
    if (
      response.data &&
      typeof response.data === 'object' &&
      response.headers['content-type']?.includes('application/json')
    ) {
      response.data = camelcaseKeys(response.data, { deep: true });
    }
    return response;
  }

  private async onGuestErrorResponse(
    error: AxiosError | Error
  ): Promise<void | AxiosError> {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (
        status === HttpStatusCode.Forbidden ||
        status === HttpStatusCode.Unauthorized
      ) {
        authService.logout();
      }
      if (error.code === AxiosError.ERR_NETWORK) {
        toastError(i18next.t('error.ERS000'));
      }
    }

    return Promise.reject(error);
  }

  private async onErrorResponse(
    error: AxiosError | Error
  ): Promise<void | AxiosError> {
    if (axios.isAxiosError(error)) {
      const { response, config } = error;
      const status = response?.status;
      try {
        switch (status) {
          case HttpStatusCode.NotAcceptable:
          case HttpStatusCode.Forbidden:
            authService.logout();
            break;
          case HttpStatusCode.Unauthorized:
            if (!this.concurrencyHandler) {
              logError(error, 'ConcurrencyHandler is not initialized');
              return Promise.reject(error);
            }

            return this.concurrencyHandler
              .execute(authService.refreshToken)
              .then(() => {
                return this.axiosInstance.request(
                  config as InternalAxiosRequestConfig
                ) as Promise<void | AxiosError>;
              })
              .catch((refreshError) => {
                if (refreshError === AxiosError.ERR_NETWORK) {
                  toastError(i18next.t('error.ERS000'));
                }
                authService.logout();
                return Promise.reject(refreshError);
              });
        }
      } catch (err) {
        if (err instanceof Error) {
          logError(err, 'Error in onErrorResponse:');
        }
      }
    }

    return Promise.reject(error);
  }

  private defaultHeaders(): AxiosHeaders {
    const headers = new AxiosHeaders();
    headers
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    return headers;
  }
}

class HttpService {
  private static instance: HttpService;
  private http: Axios;
  private guessHttp: Axios;
  private protectedHttp: Axios;

  private constructor() {
    this.guessHttp = new AxiosConfig().guessAxios();
    this.protectedHttp = new AxiosConfig().protectedAxios();
    this.http = this.guessHttp;
  }

  public static getInstance(): HttpService {
    if (!HttpService.instance) {
      HttpService.instance = new HttpService();
    }

    return HttpService.instance;
  }

  public protected() {
    this.http = this.protectedHttp;
  }

  public guess() {
    this.http = this.guessHttp;
  }

  public get<T>(url: string, config?: any) {
    return this.http.get<T>(url, config);
  }

  public post<T>(url: string, data: any) {
    return this.http.post<T>(url, data);
  }

  public put<T>(url: string, data: any) {
    return this.http.put<T>(url, data);
  }

  public delete<T>(url: string, config?: any) {
    return this.http.delete<T>(url, config);
  }
}

export interface ApiResponse<K> {
  data: K;
  code: string;
  status?: string;
}

const responseParse = <K, T extends ApiResponse<K> = ApiResponse<K>>(
  response: Promise<AxiosResponse<T, any>>
): Promise<ResponseError | T> => {
  return response
    .then((res) => {
      if (res.status >= 200 && res.status < 300) {
        return {
          data: res.data.data,
          code: res.data.code,
        } as T;
      }

      return new ResponseError(i18next.t(res.data.code));
    })
    .catch(() => {
      return new ResponseError(i18next.t('error.ERS001'));
    });
};

export function apiFactory(url: string, protectedApi: boolean = true) {
  const http = HttpService.getInstance();
  if (protectedApi) {
    http.protected();
  } else {
    http.guess();
  }

  const api = {
    addPathParam: (key: string, value: string) => {
      if (url.includes(key)) {
        url = url.replace(key, value);
      }
      return api;
    },
    addQueryParam: (param: string, value: string | number | null) => {
      if (!value) return api;

      if (url.includes('?')) {
        url += `&${param}=${value}`;
      } else {
        url += `?${param}=${value}`;
      }
      return api;
    },

    // GET, POST, PUT, DELETE
    get: <K, T extends ApiResponse<K> = ApiResponse<K>>(params?: any) =>
      responseParse(http.get<T>(url, { params })),
    post: <K, T extends ApiResponse<K> = ApiResponse<K>>(data?: any) =>
      responseParse(http.post<T>(url, data)),
    put: <K, T extends ApiResponse<K> = ApiResponse<K>>(data?: any) =>
      responseParse(http.put<T>(url, data)),
    delete: <K, T extends ApiResponse<K> = ApiResponse<K>>(config?: any) =>
      responseParse(http.delete<T>(url, { config })),
  };

  return api;
}

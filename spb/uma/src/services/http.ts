import axios, {
  Axios,
  AxiosError,
  AxiosHeaders,
  AxiosResponse,
  HttpStatusCode,
  InternalAxiosRequestConfig,
} from 'axios';

import ConcurrencyHandler from '@/helpers/concurrency';
import { ResponseError } from '@/helpers/error';
import i18next from '@/helpers/i18n';
import { getData } from '@/helpers/storage';
import authService from '@/services/auth.service';
import { API_URL } from '@env';

class AxiosConfig {
  private axiosInstance: Axios;
  private concurrencyHandler: ConcurrencyHandler;

  constructor() {
    console.log(API_URL);
    this.axiosInstance = axios.create({
      baseURL: API_URL,
      headers: this.defaultHeaders(),
    });

    this.concurrencyHandler = new ConcurrencyHandler();
  }

  public guessAxios(): Axios {
    return this.axiosInstance;
  }

  public protectedAxios(): Axios {
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
    const token = await getData('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }

  private onResponse(response: AxiosResponse): AxiosResponse {
    return response;
  }

  private async onErrorResponse(
    error: AxiosError | Error
  ): Promise<void | AxiosError> {
    if (axios.isAxiosError(error)) {
      const { response, config } = error;
      const status = response?.status;

      switch (status) {
        case HttpStatusCode.NotAcceptable:
        case HttpStatusCode.Forbidden:
          authService.logout();
          break;
        case HttpStatusCode.Unauthorized:
          // Use the concurrency handler to prevent multiple requests
          // from refreshing the token at the same time
          return await this.concurrencyHandler
            .execute(authService.refreshToken)
            .then(() => {
              // Retry the original request
              return this.axiosInstance.request(
                config as InternalAxiosRequestConfig
              );
            });
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

export const apiFactory = (url: string, protectedApi: boolean = true) => {
  const http = HttpService.getInstance();
  if (protectedApi) {
    http.protected();
  } else {
    http.guess();
  }

  return {
    get: <K, T extends ApiResponse<K> = ApiResponse<K>>(params?: any) =>
      responseParse(http.get<T>(url, { params })),
    post: <K, T extends ApiResponse<K> = ApiResponse<K>>(data?: any) =>
      responseParse(http.post<T>(url, data)),
    put: <K, T extends ApiResponse<K> = ApiResponse<K>>(data?: any) =>
      responseParse(http.put<T>(url, data)),
    delete: <K, T extends ApiResponse<K> = ApiResponse<K>>(config?: any) =>
      responseParse(http.delete<T>(url, { config })),
  };
};

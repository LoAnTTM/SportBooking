import {
  FORGOT_PASSWORD_PATH,
  GOOGLE_SIGNIN_CALLBACK_PATH,
  LOGIN_PATH,
  LOGOUT_PATH,
  REFRESH_TOKEN_PATH,
  REGISTER_PATH,
  RESEND_VERIFY_REGISTER_TOKEN_PATH,
  RESET_PASSWORD_PATH,
  VERIFY_FORGOT_PASSWORD_TOKEN_PATH,
  VERIFY_REGISTER_TOKEN_PATH,
} from '@/constants';
import { ResponseError } from '@/helpers/error';
import { removeData, storeData } from '@/helpers/storage';
import { apiFactory, ApiResponse } from '@/services/http';

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  user: {
    user_id: string;
    email: string;
    full_name: string;
  };
};

export type RegisterRequest = {
  email: string;
  password: string;
};

export type RefreshTokenResponse = {
  access_token: string;
};

export type GoogleCallbackRequest = {
  code: string;
};

export interface IAuthService {
  login(
    data: LoginRequest
  ): Promise<ApiResponse<LoginResponse> | ResponseError>;

  logout(): Promise<void>;

  register(data: RegisterRequest): Promise<ApiResponse<null> | ResponseError>;

  refreshToken(): Promise<ApiResponse<RefreshTokenResponse> | ResponseError>;

  googleCallback(
    data: GoogleCallbackRequest
  ): Promise<ApiResponse<LoginResponse> | ResponseError>;

  verifyEmail(
    token: number,
    email: string
  ): Promise<ApiResponse<null> | ResponseError>;

  resendVerifyEmailOtp(
    email: string
  ): Promise<ApiResponse<null> | ResponseError>;
}

class AuthService {
  public async login(
    data: LoginRequest
  ): Promise<ApiResponse<LoginResponse> | ResponseError> {
    const api = apiFactory(LOGIN_PATH, false);
    const response = await api.post<LoginResponse>(data);

    if ('data' in response) {
      await storeData('accessToken', response.data.access_token);
    }
    return response;
  }

  public async logout(): Promise<void> {
    const api = apiFactory(LOGOUT_PATH, false);
    await api.post();

    removeData('accessToken');
  }

  public async register(
    data: RegisterRequest
  ): Promise<ApiResponse<null> | ResponseError> {
    const api = apiFactory(REGISTER_PATH, false);
    return await api.post(data);
  }

  public async refreshToken(): Promise<
    ApiResponse<RefreshTokenResponse> | ResponseError
  > {
    const api = apiFactory(REFRESH_TOKEN_PATH);
    const response = await api.post<RefreshTokenResponse>();

    if ('data' in response) {
      await storeData('accessToken', response.data.access_token);
    }
    return response;
  }

  public async googleCallback(
    data: GoogleCallbackRequest
  ): Promise<ApiResponse<LoginResponse> | ResponseError> {
    const api = apiFactory(GOOGLE_SIGNIN_CALLBACK_PATH, false);
    const response = await api.post<LoginResponse>(data);

    if ('data' in response) {
      await storeData('accessToken', response.data.access_token);
    }
    return response;
  }

  public verifyRegisterToken(
    token: number,
    email: string
  ): Promise<ApiResponse<null> | ResponseError> {
    const api = apiFactory(VERIFY_REGISTER_TOKEN_PATH, false);
    return api.post({ token, email });
  }

  public resendVerifyRegisterToken(
    email: string
  ): Promise<ApiResponse<null> | ResponseError> {
    const api = apiFactory(RESEND_VERIFY_REGISTER_TOKEN_PATH, false);
    return api.post({ email });
  }

  public forgotPassword(
    email: string
  ): Promise<ApiResponse<null> | ResponseError> {
    const api = apiFactory(FORGOT_PASSWORD_PATH, false);
    return api.post({ email });
  }

  public verifyForgotPasswordToken(
    token: number,
    email: string
  ): Promise<ApiResponse<null> | ResponseError> {
    const api = apiFactory(VERIFY_FORGOT_PASSWORD_TOKEN_PATH, false);
    return api.post({ token, email });
  }

  public resetPassword(
    token: number,
    email: string,
    password: string
  ): Promise<ApiResponse<null> | ResponseError> {
    const api = apiFactory(RESET_PASSWORD_PATH, false);
    return api.post({ token, email, password });
  }
}

const authService = new AuthService();
export default authService;

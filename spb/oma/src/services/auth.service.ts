import {
  FORGOT_PASSWORD_PATH, GOOGLE_SIGNIN_CALLBACK_PATH, LOGIN_PATH, LOGOUT_PATH, REFRESH_TOKEN_PATH,
  REGISTER_PATH, RESEND_VERIFY_REGISTER_TOKEN_PATH, RESET_PASSWORD_PATH,
  VERIFY_FORGOT_PASSWORD_TOKEN_PATH, VERIFY_REGISTER_TOKEN_PATH
} from '@/constants';
import { ResponseError } from '@/helpers/error';
import { logError } from '@/helpers/logger';
import { removeData, storeData } from '@/helpers/storage';
import { apiFactory, ApiResponse } from '@/services/http';
import {
  GoogleCallbackRequest, LoginRequest, LoginResponse, RefreshTokenResponse, RegisterRequest
} from '@/services/types';

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
    const response = await apiFactory(LOGIN_PATH, false).post<LoginResponse>(
      data
    );

    if ('data' in response) {
      await storeData('accessToken', response.data.accessToken);
    }
    return response;
  }

  public async logout(): Promise<void> {
    try {
      await apiFactory(LOGOUT_PATH, false).post();
    } catch (error) {
      if (error instanceof Error) {
        logError(error, 'Logout error');
      }
    }
    removeData('accessToken');
  }

  public register(
    data: RegisterRequest
  ): Promise<ApiResponse<null> | ResponseError> {
    return apiFactory(REGISTER_PATH, false).post(data);
  }

  public async refreshToken(): Promise<
    ApiResponse<RefreshTokenResponse> | ResponseError
  > {
    const response =
      await apiFactory(REFRESH_TOKEN_PATH).post<RefreshTokenResponse>();

    if (response instanceof ResponseError) {
      return response;
    }

    if ('data' in response) {
      await storeData('accessToken', response.data.accessToken);
    }
    return response;
  }

  public async googleCallback(
    data: GoogleCallbackRequest
  ): Promise<ApiResponse<LoginResponse> | ResponseError> {
    const response = await apiFactory(
      GOOGLE_SIGNIN_CALLBACK_PATH,
      false
    ).post<LoginResponse>(data);

    if ('data' in response) {
      await storeData('accessToken', response.data.accessToken);
    }
    return response;
  }

  public verifyRegisterToken(
    token: number,
    email: string
  ): Promise<ApiResponse<null> | ResponseError> {
    return apiFactory(VERIFY_REGISTER_TOKEN_PATH, false).post({
      token,
      email,
    });
  }

  public resendVerifyRegisterToken(
    email: string
  ): Promise<ApiResponse<null> | ResponseError> {
    return apiFactory(RESEND_VERIFY_REGISTER_TOKEN_PATH, false).post({
      email,
    });
  }

  public forgotPassword(
    email: string
  ): Promise<ApiResponse<null> | ResponseError> {
    return apiFactory(FORGOT_PASSWORD_PATH, false).post({ email });
  }

  public verifyForgotPasswordToken(
    token: number,
    email: string
  ): Promise<ApiResponse<null> | ResponseError> {
    return apiFactory(VERIFY_FORGOT_PASSWORD_TOKEN_PATH, false).post({
      token,
      email,
    });
  }

  public resetPassword(
    token: number,
    email: string,
    password: string
  ): Promise<ApiResponse<null> | ResponseError> {
    return apiFactory(RESET_PASSWORD_PATH, false).post({
      token,
      email,
      password,
    });
  }
}

const authService = new AuthService();
export default authService;

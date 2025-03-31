const V1_PREFIX = '/api/v1';

export const GOOGLE_SIGNIN_CALLBACK_PATH = '/api/auth/google/callback';

export const LOGIN_PATH = `${V1_PREFIX}/auth/login`;

export const LOGOUT_PATH = `${V1_PREFIX}/auth/logout`;

export const REGISTER_PATH = `${V1_PREFIX}/auth/register`;

export const REFRESH_TOKEN_PATH = `${V1_PREFIX}/auth/refresh`;

export const VERIFY_REGISTER_TOKEN_PATH = `${V1_PREFIX}/auth/verify-register-token`;

export const RESEND_VERIFY_REGISTER_TOKEN_PATH = `${V1_PREFIX}/auth/verify-register-token/resend`;

export const FORGOT_PASSWORD_PATH = `${V1_PREFIX}/auth/forgot-password`;

export const VERIFY_FORGOT_PASSWORD_TOKEN_PATH = `${V1_PREFIX}/auth/verify-forgot-password-token`;

export const RESET_PASSWORD_PATH = `${V1_PREFIX}/auth/reset-password`;

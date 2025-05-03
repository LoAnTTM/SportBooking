const V1_PREFIX = '/api/v1';

// Auth API paths
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

export const CHANGE_PASSWORD_PATH = `${V1_PREFIX}/auth/change-password`;

// Unit API paths
export const POPULAR_UNITS_PATH = `${V1_PREFIX}/units/popularity`;

export const SEARCH_UNITS_PATH = `${V1_PREFIX}/units`;

export const GET_UNIT_PATH = `${V1_PREFIX}/units/:id`;

export const GET_BOOKED_TIME_PATH = `${V1_PREFIX}/units/:id/booked-time`;

// Order API paths
export const GET_ORDERS_BY_USER_ID_PATH = `${V1_PREFIX}/orders/:userId`;

export const PROCESS_PAYMENT_PATH = `${V1_PREFIX}/orders/pay`;

// Notification API paths
export const RECEIVER_NOTIFICATIONS_PATH = `${V1_PREFIX}/notifications/receiver/:id`;

export const SENDER_NOTIFICATIONS_PATH = `${V1_PREFIX}/notifications/sender/:id`;

// Location API paths
export const PROVINCE_PATH = `${V1_PREFIX}/addresses/provinces`;

export const DISTRICT_PATH = `${V1_PREFIX}/addresses/provinces/:id/districts`;

export const WARD_PATH = `${V1_PREFIX}/addresses/districts/:id/wards`;

// Sport type API paths
export const GET_ALL_SPORT_TYPE_PATH = `${V1_PREFIX}/sport-types`;

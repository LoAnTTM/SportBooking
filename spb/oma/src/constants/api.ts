const V1_PREFIX = '/api/v1';

// Auth API paths
export const LOGIN_PATH = `${V1_PREFIX}/auth/login`;

export const LOGOUT_PATH = `${V1_PREFIX}/auth/logout`;

export const REFRESH_TOKEN_PATH = `${V1_PREFIX}/auth/refresh`;

export const VERIFY_REGISTER_TOKEN_PATH = `${V1_PREFIX}/auth/verify-register-token`;

export const RESEND_VERIFY_REGISTER_TOKEN_PATH = `${V1_PREFIX}/auth/verify-register-token/resend`;

export const FORGOT_PASSWORD_PATH = `${V1_PREFIX}/auth/forgot-password`;

export const VERIFY_FORGOT_PASSWORD_TOKEN_PATH = `${V1_PREFIX}/auth/verify-forgot-password-token`;

export const RESET_PASSWORD_PATH = `${V1_PREFIX}/auth/reset-password`;

export const CHANGE_PASSWORD_PATH = `${V1_PREFIX}/auth/change-password`;

// Order API paths
export const GET_ORDERS_BY_USER_ID_PATH = `${V1_PREFIX}/orders/:userId`;

export const PROCESS_PAYMENT_PATH = `${V1_PREFIX}/orders/pay`;

export const GET_ORDER_BY_CLUB_ID_PATH = `${V1_PREFIX}/orders/club/:clubId`;

// Location API paths
export const PROVINCE_PATH = `${V1_PREFIX}/addresses/provinces`;

export const DISTRICT_PATH = `${V1_PREFIX}/addresses/provinces/:id/districts`;

export const WARD_PATH = `${V1_PREFIX}/addresses/districts/:id/wards`;

// Sport type API paths
export const GET_ALL_SPORT_TYPE_PATH = `${V1_PREFIX}/sport-types`;

// Club API paths
export const GET_CLUB_BY_OWNER_PATH = `${V1_PREFIX}/clubs/owner/:owner_id`;

export const UPDATE_CLUB_PATH = `${V1_PREFIX}/clubs/:id`;

export const UPDATE_UNIT_PATH = `${V1_PREFIX}/units/:id`;

export const ADD_UNIT_PATH = `${V1_PREFIX}/units`;

// Media API paths
export const UPLOAD_MEDIA_PATH = `${V1_PREFIX}/media/upload`;

export const ADD_MEDIA_TO_CLUB_PATH = `${V1_PREFIX}/clubs/:clubId/media`;

export const REMOVE_MEDIA_FROM_CLUB_PATH = `${V1_PREFIX}/clubs/media/:mediaId`;

export const ADD_MEDIA_TO_UNIT_PATH = `${V1_PREFIX}/units/:unitId/media`;

export const REMOVE_MEDIA_FROM_UNIT_PATH = `${V1_PREFIX}/units/media/:mediaId`;

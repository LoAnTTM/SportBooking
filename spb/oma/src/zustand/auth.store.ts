import { create } from 'zustand';

import { logDebug } from '@/helpers/logger';
import { getData, removeData, storeData } from '@/helpers/storage';
import authService from '@/services/auth.service';
import { LoginRequest, RegisterRequest } from '@/services/types';
import { createSelectors } from '@/zustand/selectors';

interface AuthState {
  isLoggedIn: boolean;
  userId: string;
  email: string;
  fullName: string;
  rememberMe: boolean;
  accessToken: string;
  role: string;
}

interface AuthActions {
  checkIsLoggedIn: () => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  verifyRegisterToken: (data: {
    token: number;
    email: string;
  }) => Promise<void>;
  resendVerifyRegisterToken: (data: { email: string }) => Promise<void>;
  forgotPassword: (data: { email: string }) => Promise<void>;
  verifyForgotPasswordToken: (data: {
    token: number;
    email: string;
  }) => Promise<void>;
  resetPassword: (data: {
    token: number;
    email: string;
    password: string;
  }) => Promise<void>;
  setRememberMe: (value: boolean) => void;
  reset: () => void;
  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<void>;
}

const initialState: AuthState = {
  isLoggedIn: false,
  userId: '',
  email: '',
  fullName: '',
  rememberMe: true,
  accessToken: '',
  role: '',
};

const useAuthStoreBase = create<AuthState & AuthActions>((set, get) => ({
  ...initialState,

  checkIsLoggedIn: async () => {
    const accessToken = await getData('accessToken');
    const userRaw = await getData('userInfo');
    const rememberMe = await getData('rememberMe');
    if (accessToken && userRaw) {
      const user = JSON.parse(userRaw);
      set(() => ({
        isLoggedIn: true,
        userId: user.userId,
        email: user.email,
        fullName: user.fullName,
        rememberMe: rememberMe ? !!rememberMe : false,
        accessToken: accessToken,
      }));
    }
  },

  login: async (data: LoginRequest) => {
    const res = await authService.login(data);
    if (res instanceof Error) {
      throw res;
    }

	if (res.data.user.role !== 'client') {
		throw new Error('You are not allowed to login');
	}

    if (get().rememberMe && 'data' in res) {
      await storeData('accessToken', res.data.accessToken);
      await storeData('userInfo', JSON.stringify(res.data.user));
    }
    set(() => ({
      isLoggedIn: true,
      userId: res.data.user.userId,
      email: res.data.user.email,
      fullName: res.data.user.fullName,
      accessToken: res.data.accessToken,
      role: res.data.user.role,
    }));
  },

  logout: async () => {
    logDebug('logout');
    await authService.logout();

    set(() => ({
      isLoggedIn: false,
      accessToken: '',
      userId: '',
      email: '',
      fullName: '',
    }));
  },

  register: async (data: RegisterRequest) => {
    const res = await authService.register(data);
    if (res instanceof Error) {
      throw res;
    }
  },

  verifyRegisterToken: async (data) => {
    const res = await authService.verifyRegisterToken(data.token, data.email);
    if (res instanceof Error) {
      throw res;
    }
  },

  resendVerifyRegisterToken: async (data) => {
    const res = await authService.resendVerifyRegisterToken(data.email);
    if (res instanceof Error) {
      throw res;
    }
  },

  forgotPassword: async (data) => {
    const res = await authService.forgotPassword(data.email);
    if (res instanceof Error) {
      throw res;
    }
  },

  verifyForgotPasswordToken: async (data) => {
    const res = await authService.verifyForgotPasswordToken(
      data.token,
      data.email
    );
    if (res instanceof Error) {
      throw res;
    }
  },

  resetPassword: async (data) => {
    const res = await authService.resetPassword(
      data.token,
      data.email,
      data.password
    );
    if (res instanceof Error) {
      throw res;
    }
  },

  setRememberMe: async (value) => {
    set({ rememberMe: value });
    try {
      if (value) {
        await storeData('rememberMe', JSON.stringify(value));
        await storeData('accessToken', get().accessToken);
        await storeData(
          'userInfo',
          JSON.stringify({
            userId: get().userId,
            email: get().email,
            fullName: get().fullName,
          })
        );
      } else {
        await removeData('rememberMe');
        await removeData('accessToken');
        await removeData('userInfo');
      }
    } catch (error) {
      console.error('Failed to store rememberMe:', error);
    }
  },

  reset: () => set(() => ({ ...initialState })),

  changePassword: async (data) => {
    const res = await authService.changePassword(
      data.currentPassword,
      data.newPassword
    );
    if (res instanceof Error) {
      throw res;
    }
  },
}));

export const useAuthStore = createSelectors(useAuthStoreBase);

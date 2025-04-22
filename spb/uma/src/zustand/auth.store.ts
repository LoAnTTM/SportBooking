import { create } from 'zustand';

import { logDebug } from '@/helpers/logger';
import { getData } from '@/helpers/storage';
import authService from '@/services/auth.service';
import { LoginRequest, RegisterRequest } from '@/services/types';
import { createSelectors } from '@/zustand/selectors';

interface AuthState {
  isLoggedIn: boolean;
  userId: string;
  email: string;
  fullName: string;
}

interface AuthActions {
  checkIsLoggedIn: () => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  googleCallback: (data: { code: string }) => Promise<void>;
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
  reset: () => void;
}

const initialState: AuthState = {
  isLoggedIn: false,
  userId: '',
  email: '',
  fullName: '',
};

const useAuthStoreBase = create<AuthState & AuthActions>((set) => ({
  ...initialState,

  checkIsLoggedIn: async () => {
    const accessToken = await getData('accessToken');
    if (accessToken) {
      set(() => ({ isLoggedIn: true }));
    }
  },

  login: async (data: LoginRequest) => {
    const res = await authService.login(data);
    if (res instanceof Error) {
      throw res;
    }

    set(() => ({
      isLoggedIn: true,
      userId: res.data.user.userId,
      email: res.data.user.email,
      fullName: res.data.user.fullName,
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

  googleCallback: async (data) => {
    const res = await authService.googleCallback(data);

    if (res instanceof Error) {
      throw res;
    }

    set(() => ({
      isLoggedIn: true,
      userId: res.data.user.userId,
      email: res.data.user.email,
      fullName: res.data.user.fullName,
    }));
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

  reset: () => set(() => ({ ...initialState })),
}));

export const useAuthStore = createSelectors(useAuthStoreBase);

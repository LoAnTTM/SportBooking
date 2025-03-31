import { create } from 'zustand';

import { getData } from '@/helpers/storage';
import authService, {
  LoginRequest,
  RegisterRequest,
} from '@/services/auth.service';
import { createSelectors } from '@/zustand/selectors';

interface AuthState {
  isLoggedIn: boolean;
  userId: string;
  email: string;
  fullName: string;

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
}

const useAuthStoreBase = create<AuthState>((set) => ({
  isLoggedIn: false,
  userId: '',
  email: '',
  fullName: '',

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
      userId: res.data.user.user_id,
      email: res.data.user.email,
      fullName: res.data.user.full_name,
    }));
  },

  logout: async () => {
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
      userId: res.data.user.user_id,
      email: res.data.user.email,
      fullName: res.data.user.full_name,
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
}));

export const useAuthStore = createSelectors(useAuthStoreBase);

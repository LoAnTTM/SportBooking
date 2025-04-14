import { UnitModel, UnitPagination } from '@/types/model';

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

export type PaginationQuery = {
  page: number | null;
  pageItems: number | null;
  orderBy: string | null;
  orderType: string | null;
};

export type SearchUnitQuery = PaginationQuery & {
  query: string | null;
  sportType: string | null;
  province: string | null;
  ward: string | null;
  district: string | null;
  longitude: number | null;
  latitude: number | null;
  radius: number | null;
};

export type GetUnitResponse = UnitModel;

export type GetUnitsResponse = {
  units: UnitModel[];
  total: number;
  pagination: UnitPagination;
};

import {
  GeographyModel, NotificationModel, OrderModel, SportTypeModel, UnitModel, UnitPagination
} from '@/types/model';

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  user: {
    userId: string;
    email: string;
    fullName: string;
  };
};

export type RegisterRequest = {
  email: string;
  password: string;
};

export type RefreshTokenResponse = {
  accessToken: string;
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

export type PopularUnitRequest = {
  longitude: number;
  latitude: number;
  radius: number;
  topN: number;
  limit: number;
};

export type GetUnitResponse = UnitModel;

export type GetUnitsResponse = {
  units: UnitModel[];
  total: number;
  pagination: UnitPagination | undefined;
};

export type PaymentResponse = {
  payUrl: string;
  appTranId: string;
};

export type ListOrderResponse = {
  orders: OrderModel[];
  total: number;
};

export type GetSportTypesResponse = {
  sportTypes: SportTypeModel[];
  total: number;
};

export type GetNotificationResponse = {
  notifications: NotificationModel[];
  total: number;
};

export type UnitPrice = {
  price: number;
  startTime: string;
  endTime: string;
  currency: string;
};

export type UnitService = {
  title: string;
  price: number;
  description: string;
};

export type UnitCard = {
  id: string;
  title: string;
  phone: string;
  openTime: Date;
  closeTime: Date;
  description: string;
  address: string;
  price: UnitPrice[];
  image: string[];
  distance: string;
  coords: GeographyModel;
  sportTypes: string[];
  services: UnitService[];
};

export type Location = {
  id: string;
  name: string;
  nameEn: string;
  code: string;
};

export type Province = Location;

export type District = Location & {
  provinceId: string;
};

export type Ward = Location & {
  districtId: string;
};

export type LocationFilter = {
  province: string;
  district: string;
  ward: string;
};

export type FilterOptions = {
  location: LocationFilter;
  sportType: string;
  isNearby: boolean;
  radius: number;
  orderBy: string;
  orderType: string;
  query?: string;
};

export type TimeRange = {
  startTime: string;
  endTime: string;
};

export type GetBookedTimeRequest = {
  bookedDay: string;
};

export type GetBookedTimeResponse = {
  bookedTimes: TimeRange[];
  total: number;
};

export type BookingTime = {
  startTime: string;
  endTime: string;
  unitId: string;
  bookedDay: string;
};

export type PaymentRequest = {
  amount: number;
  orderInfo: string;
  userId: string;
  startTime: string;
  endTime: string;
  bookingDay: string;
  unitId: string;
  unitName: string;
  timestamp: string;
};

export type CalendarSection = {
  title: string;
  data: CalendarEvent[];
};

export type CalendarEvent = {
  startTime: Date;
  endTime: Date;
  duration: string;
  title: string;
  price: number;
  currency: string;
  itemCustomHeightType?: string;
  id: string;
};

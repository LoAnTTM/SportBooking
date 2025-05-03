// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  code?: string;
  error?: string;
}

// Pagination Types
export interface PaginationParams {
  i?: number; // items per page
  p?: number; // page number
  b?: string; // sort by
  t?: string; // sort type (asc/desc)
  q?: string; // search query
  st?: string; // sport type
  pv?: string; // province
  wd?: string; // ward
  dt?: string; // district
}


// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface RefreshResponse {
  access_token: string;
}

// User Types
export interface User {
  user_id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: Role;
  is_email_verified?: boolean;
}

export interface Role {
	role_id: string;
	role_name: string;
	permissions: number;
}

export interface Users {
	users: User[];
	total: number;
}

// Club Types
export interface Club {
  id: string;
  name: string;
  phone: string;
  owner_id: string;
  description?: string;
  created_at: string;
  updated_at: string;
  address?: Address;
  media?: Media[];
  sport_types?: SportType[];
}

export interface Clubs {
	clubs: Club[];
	total: number;
}

export interface CreateClubRequest {
  name: string;
  phone: string;
  owner_id: string;
  description?: string;
  address?: {
    address: string;
    ward_id: string;
    location_geography?: {
      longitude: number;
      latitude: number;
    };
  };
  media?: {
    file_path: string;
    file_type: string;
    hash: string;
  }[];
  sport_types?: string[];
}

export interface UpdateClubRequest {
  name?: string;
  phone?: string;
  description?: string;
  address?: {
    address?: string;
    ward_id?: string;
    location_geography?: {
      longitude: number;
      latitude: number;
    };
  };
}

// Unit Types
export interface Unit {
  id: string;
  name: string;
  open_time: string;
  close_time: string;
  phone: string;
  description?: string;
  status: number;
  club_id: string;
  created_at: string;
  updated_at: string;
  address?: Address;
  media?: Media[];
  sport_types?: SportType[];
  unit_prices?: UnitPrice[];
  unit_services?: UnitService[];
}

export interface UnitPrice {
  id: string;
  price: number;
  currency: string;
  start_time: string;
  end_time: string;
  unit_id: string;
  created_at: string;
  updated_at: string;
}

export interface UnitService {
  id: string;
  name: string;
  icon: string;
  price: number;
  currency: string;
  description: string;
  status: number;
  unit_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUnitRequest {
  name: string;
  open_time: string;
  close_time: string;
  phone: string;
  description?: string;
  status: number;
  club_id: string;
  address: {
    address: string;
    ward_id: string;
    location_geography?: {
      longitude: number;
      latitude: number;
    };
  };
  unit_prices: {
    price: number;
    currency: string;
    start_time: string;
    end_time: string;
  }[];
  unit_services?: {
    name: string;
    icon: string;
    price: number;
    currency: string;
    description: string;
    status: number;
  }[];
  media?: {
    file_path: string;
    file_type: string;
    hash: string;
  }[];
  sport_types?: string[];
}

export interface UpdateUnitRequest {
  name?: string;
  open_time?: string;
  close_time?: string;
  phone?: string;
  description?: string;
  status?: number;
  address?: {
    address?: string;
    ward_id?: string;
    location_geography?: {
      longitude: number;
      latitude: number;
    };
  };
}

// Address Types
export interface Address {
  address_id: string;
  address: string;
  location_geography?: {
	  longitude: number;
	  latitude: number;
	};
	ward: string;
	ward_code: string;
	district: string;
	district_code: string;
	province: string;
	province_code: string;
}

export interface Province {
  id: string;
  name: string;
  code: string;
}

export interface District {
  id: string;
  name: string;
  code: string;
  province_id: string;
}

export interface Ward {
  id: string;
  name: string;
  code: string;
  district_id: string;
}

// Media Types
export interface Media {
  media_id: string;
  file_path: string;
  file_type: string;
  hash: string;
}

export interface CreateMediaRequest {
  file_path: string;
  file_type: string;
  hash: string;
}

// Sport Type
export interface SportType {
  id: string;
  name: string;
}

export interface CreateSportTypeRequest {
  name: string;
}

// Order Types
export interface Order {
  id: string;
  amount: number;
  order_info: string;
  user_id: string;
  start_time: string;
  end_time: string;
  booking_day: string;
  unit_id: string;
  unit_name: string;
  timestamp: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface PayRequest {
  amount: number;
  order_info: string;
  user_id: string;
  start_time: string;
  end_time: string;
  booking_day: string;
  unit_id: string;
  unit_name: string;
  timestamp: string;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  notification_type_id: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

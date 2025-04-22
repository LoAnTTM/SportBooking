export type GeographyModel = {
  longitude: number;
  latitude: number;
};

export type AddressModel = {
  id: string;
  address: string;
  locationGeography: GeographyModel;
  ward: string;
  wardCode: string;
  district: string;
  districtCode: string;
  province: string;
  provinceCode: string;
};

export type UnitPriceModel = {
  id: string;
  price: number;
  currency: string;
  startTime: string;
  endTime: string;
};

export type UnitServiceModel = {
  id: string;
  name: string;
  icon: string;
  price: number;
  currency: string;
  description: string;
  status: number;
};

export type MediaModel = {
  id: string;
  filePath: string;
  fileType: string;
  hash: string;
};

export type SportTypeModel = {
  id: string;
  name: string;
};

export type UnitModel = {
  id: string;
  name: string;
  openTime: string;
  closeTime: string;
  phone: string;
  description: string;
  address: AddressModel;
  unitPrices: UnitPriceModel[] | null;
  unitServices: UnitServiceModel[] | null;
  media: MediaModel[] | null;
  sportTypes: SportTypeModel[] | null;
};

export type Pagination = {
  page: number;
  pageItems: number;
  orderBy: string;
  orderType: string;
  totalItems: number;
  totalPages: number;
  nextPage: string;
  prevPage: string;
};

export type UnitPagination = Pagination & {
  query: string;
  sportType: string;
  province: string;
  ward: string;
  district: string;
  longitude: number;
  latitude: number;
  radius: number;
};

export type OrderItemModel = {
  id: string;
  price: number;
  startTime: string;
  endTime: string;
  itemId: string;
  itemName: string;
  quantity: number;
  itemType: string;
};

export type OrderModel = {
  id: string;
  totalAmount: number;
  currency: string;
  status: string;
  orderItems: OrderItemModel[];
  createdAt: string;
};

export type NotificationModel = {
  id: string;
  status: string;
  platform: string;
  title: string;
  message: string;
  notificationTypeId: string;
  sender: string | null;
  receiver: string | null;
};

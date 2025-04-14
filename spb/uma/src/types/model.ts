export type GeographyModel = {
  longitude: number;
  latitude: number;
};

export type AddressModel = {
  addressId: string;
  address: string;
  geography: GeographyModel;
  ward: string;
  wardCode: string;
  district: string;
  districtCode: string;
  province: string;
  provinceCode: string;
};

export type UnitPriceModel = {
  unitPriceId: string;
  price: number;
  currency: string;
  startTime: string;
  endTime: string;
};

export type UnitServiceModel = {
  unitServiceId: string;
  name: string;
  icon: string;
  price: number;
  currency: string;
  description: string;
  status: number;
};

export type MediaModel = {
  mediaId: string;
  filePath: string;
  fileType: string;
  hash: string;
};

export type SportTypeModel = {
  sportTypeId: string;
  name: string;
};

export type UnitModel = {
  unitId: string;
  name: string;
  openTime: string;
  closeTime: string;
  phone: string;
  description: string;
  address: AddressModel;
  unitPrices: UnitPriceModel[];
  unitServices: UnitServiceModel[];
  media: MediaModel[];
  sportTypes: SportTypeModel[];
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

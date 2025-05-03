import { AddressModel, MediaModel, SportTypeModel } from './model';

export type UnitPrice = {
  id: string;
  price: number;
  currency: string;
  startTime: string;
  endTime: string;
};

export type UnitService = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
};

export type Unit = {
  id: string;
  name: string;
  openTime: string;
  closeTime: string;
  phone: string;
  description: string;
  status: number; // 1 = active, 0 = inactive
  address: AddressModel;
  sportTypes: SportTypeModel[];
  images: MediaModel[];
  services: UnitService[];
  prices: UnitPrice[];
};

export type Club = {
  id: string;
  name: string;
  phone: string;
  address: AddressModel;
  description: string;
  images: MediaModel[];
  sportTypes: SportTypeModel[];
  units: Unit[];
};

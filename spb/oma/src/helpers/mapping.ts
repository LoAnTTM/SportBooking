import { stringTimeToDateTime } from '@/helpers/function';
import { UnitCard, UnitPrice, UnitService } from '@/services/types';
import {
  AddressModel, GeographyModel, MediaModel, SportTypeModel, UnitModel, UnitPriceModel,
  UnitServiceModel
} from '@/types/model';

export const mappingAddressModelToString = (
  address: AddressModel | null
): string => {
  if (!address) {
    return '';
  }
  return `${address.address}, ${address.ward}, ${address.district}, ${address.province}`;
};

export const mappingMediaModelToString = (
  media: MediaModel[] | null
): string[] => {
  if (!media) {
    return [];
  }
  return media.map((item) => item.filePath);
};

export const mappingUnitPriceModelToUnitPrice = (
  unitPrice: UnitPriceModel
): UnitPrice => {
  return {
    price: unitPrice.price,
    startTime: unitPrice.startTime,
    endTime: unitPrice.endTime,
    currency: unitPrice.currency,
  } as UnitPrice;
};

export const mappingUnitServiceModelToUnitService = (
  service: UnitServiceModel[]
): UnitService[] => {
  return service.map((item) => ({
    title: item.name,
    price: item.price,
    description: item.description,
  }));
};

export const mappingSportTypesToString = (
  sportTypes: SportTypeModel[]
): string[] => {
  return sportTypes.map((item) => item.name);
};

export const mappingUnitModelToUnitCard = (unit: UnitModel): UnitCard => {
  return {
    id: unit.id,
    title: unit.name,
    phone: unit.phone,
    openTime: stringTimeToDateTime(unit.openTime),
    closeTime: stringTimeToDateTime(unit.closeTime),
    description: unit.description,
    address: mappingAddressModelToString(unit.address),
    image: mappingMediaModelToString(unit.media),
    price: unit.unitPrices?.map(mappingUnitPriceModelToUnitPrice) || [],
    coords: {
      latitude: unit.address.locationGeography.latitude,
      longitude: unit.address.locationGeography.longitude,
    } as GeographyModel,
    services: mappingUnitServiceModelToUnitService(unit.unitServices || []),
    sportTypes: mappingSportTypesToString(unit.sportTypes || []),
  } as UnitCard;
};

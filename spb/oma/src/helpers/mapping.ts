import { UnitCard, UnitPrice } from '@/services/types';
import { AddressModel, GeographyModel, MediaModel, UnitModel, UnitPriceModel } from '@/types/model';

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

export const mappingUnitModelToUnitCard = (unit: UnitModel): UnitCard => {
  return {
    id: unit.id,
    title: unit.name,
    address: mappingAddressModelToString(unit.address),
    image: mappingMediaModelToString(unit.media),
    price: unit.unitPrices?.map(mappingUnitPriceModelToUnitPrice) || [],
    coords: {
      latitude: unit.address.locationGeography.latitude,
      longitude: unit.address.locationGeography.longitude,
    } as GeographyModel,
  } as UnitCard;
};

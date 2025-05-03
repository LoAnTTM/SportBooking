import { Club, Unit, UnitPrice, UnitService } from '@/types/club';
import { AddressModel, MediaModel, SportTypeModel } from '@/types/model';
import { PLACEHOLDER_IMAGE } from '@env';

// Mock sport types
export const mockSportTypes: SportTypeModel[] = [
  { id: '1', name: 'Football' },
  { id: '2', name: 'Basketball' },
  { id: '3', name: 'Tennis' },
  { id: '4', name: 'Swimming' },
  { id: '5', name: 'Volleyball' },
  { id: '6', name: 'Badminton' },
  { id: '7', name: 'Table Tennis' },
  { id: '8', name: 'Golf' },
];

// Mock address
const mockAddress: AddressModel = {
  id: '1',
  address: '123 Sports Street',
  locationGeography: {
    latitude: 10.762622,
    longitude: 106.660172,
  },
  ward: 'Ward 1',
  wardCode: 'W1',
  district: 'District 1',
  districtCode: 'D1',
  province: 'Ho Chi Minh City',
  provinceCode: 'HCM',
};

// Mock media
const mockImages: MediaModel[] = [
  {
    id: '1',
    filePath: PLACEHOLDER_IMAGE,
    fileType: 'image/jpeg',
    hash: 'hash1',
  },
  {
    id: '2',
    filePath: PLACEHOLDER_IMAGE,
    fileType: 'image/jpeg',
    hash: 'hash2',
  },
];

// Mock unit prices
const mockUnitPrices: UnitPrice[] = [
  {
    id: '1',
    price: 30000,
    currency: 'VND',
    startTime: '12:00',
    endTime: '14:00',
  },
  {
    id: '2',
    price: 50000,
    currency: 'VND',
    startTime: '14:00',
    endTime: '20:00',
  },
];

// Mock unit services
const mockUnitServices: UnitService[] = [
  {
    id: '1',
    name: 'Equipment Rental',
    description: 'Rent sports equipment',
    price: 10000,
    currency: 'VND',
  },
  {
    id: '2',
    name: 'Coaching',
    description: 'Professional coaching service',
    price: 200000,
    currency: 'VND',
  },
  {
    id: '3',
    name: 'Refreshments',
    description: 'Drinks and snacks',
    price: 15000,
    currency: 'VND',
  },
];

// Mock units
const mockUnits: Unit[] = [
  {
    id: '1',
    name: 'Main Football Field',
    openTime: '08:00',
    closeTime: '22:00',
    phone: '0123456789',
    description: 'Standard football field with artificial grass',
    address: mockAddress,
    sportTypes: [mockSportTypes[0]],
    images: mockImages,
    services: mockUnitServices,
    prices: mockUnitPrices,
  },
  {
    id: '2',
    name: 'Basketball Court',
    openTime: '08:00',
    closeTime: '22:00',
    phone: '0123456789',
    description: 'Indoor basketball court with wooden floor',
    address: mockAddress,
    sportTypes: [mockSportTypes[1]],
    images: mockImages,
    services: mockUnitServices,
    prices: mockUnitPrices,
  },
];

// Mock club
export const mockClub: Club = {
  id: '1',
  name: 'Sports Club Center',
  phone: '0987654321',
  address: mockAddress,
  description: 'A multi-sport facility offering various sports activities',
  images: mockImages,
  sportTypes: [mockSportTypes[0], mockSportTypes[1], mockSportTypes[2]],
  units: mockUnits,
};

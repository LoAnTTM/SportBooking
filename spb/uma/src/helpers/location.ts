import { GeographyModel } from '@/types/model';

export const calculateDistance = (
  point1: GeographyModel,
  point2: GeographyModel
): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = degreesToRadians(point2.latitude - point1.latitude);
  const dLon = degreesToRadians(point2.longitude - point1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(point1.latitude)) *
      Math.cos(degreesToRadians(point2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
};

const degreesToRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

import { DISTRICT_PATH, PROVINCE_PATH, WARD_PATH } from '@/constants';
import { ResponseError } from '@/helpers/error';
import { apiFactory, ApiResponse } from '@/services/http';
import { Location } from '@/services/types';

interface ILocationService {
  fetchProvince: () => Promise<ApiResponse<Location[]> | ResponseError>;
  fetchDistrict: (
    provinceId: string
  ) => Promise<ApiResponse<Location[]> | ResponseError>;
  fetchWard: (
    DistrictId: string
  ) => Promise<ApiResponse<Location[]> | ResponseError>;
}

class LocationService implements ILocationService {
  fetchProvince(): Promise<ApiResponse<Location[]> | ResponseError> {
    return apiFactory(PROVINCE_PATH).get<Location[]>();
  }

  fetchDistrict(
    provinceId: string
  ): Promise<ApiResponse<Location[]> | ResponseError> {
    return apiFactory(DISTRICT_PATH)
      .addPathParam(':id', provinceId)
      .get<Location[]>();
  }

  fetchWard(
    DistrictId: string
  ): Promise<ApiResponse<Location[]> | ResponseError> {
    return apiFactory(WARD_PATH)
      .addPathParam(':id', DistrictId)
      .get<Location[]>();
  }
}

const locationService = new LocationService();
export default locationService;

import {
  GET_BOOKED_TIME_PATH, GET_UNIT_PATH, POPULAR_UNITS_PATH, SEARCH_UNITS_PATH
} from '@/constants';
import { ResponseError } from '@/helpers/error';
import { PARAMS } from '@/helpers/pagination';
import { apiFactory, ApiResponse } from '@/services/http';
import {
  GetBookedTimeRequest, GetBookedTimeResponse, GetUnitResponse, GetUnitsResponse,
  PopularUnitRequest, SearchUnitQuery
} from '@/services/types';

export interface IUnitService {
  getPopularUnits: (
    reqBody: PopularUnitRequest
  ) => Promise<ApiResponse<GetUnitsResponse> | ResponseError>;

  search: (
    query: SearchUnitQuery
  ) => Promise<ApiResponse<GetUnitsResponse> | ResponseError>;

  getDetail: (
    id: string
  ) => Promise<ApiResponse<GetUnitResponse> | ResponseError>;

  bookedTime: (
    unitId: string,
    data: GetBookedTimeRequest
  ) => Promise<ApiResponse<GetBookedTimeResponse> | ResponseError>;
}

class UnitService implements IUnitService {
  getPopularUnits(
    reqBody: PopularUnitRequest
  ): Promise<ApiResponse<GetUnitsResponse> | ResponseError> {
    return apiFactory(POPULAR_UNITS_PATH).post<GetUnitsResponse>(reqBody);
  }

  search(
    params: SearchUnitQuery
  ): Promise<ApiResponse<GetUnitsResponse> | ResponseError> {
    return apiFactory(SEARCH_UNITS_PATH)
      .addQueryParam(PARAMS.pageItems, params.pageItems)
      .addQueryParam(PARAMS.page, params.page)
      .addQueryParam(PARAMS.orderBy, params.orderBy)
      .addQueryParam(PARAMS.orderType, params.orderType)
      .addQueryParam(PARAMS.query, params.query)
      .addQueryParam(PARAMS.sportType, params.sportType)
      .addQueryParam(PARAMS.province, params.province)
      .addQueryParam(PARAMS.ward, params.ward)
      .addQueryParam(PARAMS.district, params.district)
      .addQueryParam(PARAMS.longitude, params.longitude)
      .addQueryParam(PARAMS.latitude, params.latitude)
      .addQueryParam(PARAMS.radius, params.radius)
      .get<GetUnitsResponse>();
  }

  getDetail(id: string): Promise<ApiResponse<GetUnitResponse> | ResponseError> {
    return apiFactory(GET_UNIT_PATH)
      .addPathParam(':id', id)
      .get<GetUnitResponse>();
  }

  bookedTime(
    unitId: string,
    data: GetBookedTimeRequest
  ): Promise<ApiResponse<GetBookedTimeResponse> | ResponseError> {
    return apiFactory(GET_BOOKED_TIME_PATH)
      .addPathParam(':id', unitId)
      .post<GetBookedTimeResponse>(data);
  }
}

const unitService = new UnitService();
export default unitService;

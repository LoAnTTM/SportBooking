import { POPULAR_UNITS_PATH, SEARCH_UNITS_PATH } from '@/constants';
import { ResponseError } from '@/helpers/error';
import { apiFactory, ApiResponse } from '@/services/http';
import { GetUnitsResponse, SearchUnitQuery } from '@/services/types';

export interface IUnitService {
  getPopularUnits: () => Promise<ApiResponse<GetUnitsResponse> | ResponseError>;
  search: (
    query: SearchUnitQuery
  ) => Promise<ApiResponse<GetUnitsResponse> | ResponseError>;
}

class UnitService implements IUnitService {
  async getPopularUnits(): Promise<
    ApiResponse<GetUnitsResponse> | ResponseError
  > {
    return await apiFactory(POPULAR_UNITS_PATH).get<GetUnitsResponse>();
  }

  async search(
    _: SearchUnitQuery
  ): Promise<ApiResponse<GetUnitsResponse> | ResponseError> {
    return apiFactory(SEARCH_UNITS_PATH)
      .addQuery('', '')
      .get<GetUnitsResponse>();
  }
}

const unitService = new UnitService();
export default unitService;

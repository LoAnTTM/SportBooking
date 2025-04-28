import { GET_ALL_SPORT_TYPE_PATH } from '@/constants';
import { ResponseError } from '@/helpers/error';
import { apiFactory, ApiResponse } from '@/services/http';
import { GetSportTypesResponse } from '@/services/types';

interface ISportTypeService {
  getSportTypes: () => Promise<
    ApiResponse<GetSportTypesResponse> | ResponseError
  >;
}

class SportTypeService implements ISportTypeService {
  getSportTypes(): Promise<ApiResponse<GetSportTypesResponse> | ResponseError> {
    return apiFactory(GET_ALL_SPORT_TYPE_PATH).get<GetSportTypesResponse>();
  }
}

const sportTypeService = new SportTypeService();
export default sportTypeService;

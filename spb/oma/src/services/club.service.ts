import {
  ADD_UNIT_PATH, GET_CLUB_BY_OWNER_PATH, UPDATE_CLUB_PATH, UPDATE_UNIT_PATH
} from '@/constants';
import { ResponseError } from '@/helpers/error';
import { apiFactory, ApiResponse } from '@/services/http';
import { ClubModel, ClubUpdateModel, UnitUpdateModel } from '@/types/model';

export interface IClubService {
  getClubByOwner: (
    ownerId: string
  ) => Promise<ApiResponse<ClubModel> | ResponseError>;

  updateClub: (
    club: ClubUpdateModel,
    clubId: string
  ) => Promise<ApiResponse<null> | ResponseError>;

  updateUnit: (
    unit: UnitUpdateModel,
    unitId: string
  ) => Promise<ApiResponse<null> | ResponseError>;

  addUnit: (
    unit: UnitUpdateModel
  ) => Promise<ApiResponse<null> | ResponseError>;
}

class ClubService implements IClubService {
  getClubByOwner(
    ownerId: string
  ): Promise<ApiResponse<ClubModel> | ResponseError> {
    return apiFactory(GET_CLUB_BY_OWNER_PATH)
      .addPathParam(':owner_id', ownerId)
      .get<ClubModel>();
  }

  updateClub(
    club: ClubUpdateModel,
    clubId: string
  ): Promise<ApiResponse<null> | ResponseError> {
    return apiFactory(UPDATE_CLUB_PATH)
      .addPathParam(':id', clubId)
      .put<null>(club);
  }

  updateUnit(
    unit: UnitUpdateModel,
    unitId: string
  ): Promise<ApiResponse<null> | ResponseError> {
    return apiFactory(UPDATE_UNIT_PATH)
      .addPathParam(':id', unitId)
      .put<null>(unit);
  }

  addUnit(unit: UnitUpdateModel): Promise<ApiResponse<null> | ResponseError> {
    return apiFactory(ADD_UNIT_PATH).post<null>(unit);
  }
}

const clubService = new ClubService();
export default clubService;

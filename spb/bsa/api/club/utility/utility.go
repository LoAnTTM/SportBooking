package utility

import (
	addr "spb/bsa/api/address/utility"
	"spb/bsa/api/club/model"
	media "spb/bsa/api/media/utility"
	st "spb/bsa/api/sport_type/utility"
	tb "spb/bsa/pkg/entities"
)

// @author: LoanTT
// @function: MapEntityToResponse
// @description: Mapping club entity to response
// @param: club *tb.Club
// @return: model.ClubResponse
func MapEntityToResponse(club *tb.Club) *model.ClubResponse {
	return &model.ClubResponse{
		ClubID:      club.ID,
		Name:        club.Name,
		OpenTime:    club.OpenTime,
		CloseTime:   club.CloseTime,
		Address:     addr.MapAddressEntityToResponse(club.Address),
		Phone:       club.Phone,
		OwnerID:     club.OwnerID,
		Description: club.Description,
		Media:       media.MapMediaEntitiesToResponse(club.Media),
		SportTypes:  st.MapSportTypeEntitiesToListResponse(club.SportTypes),
	}
}

func MapCreateRequestToEntity(reqBody *model.CreateClubRequest) *tb.Club {
	return &tb.Club{
		Name:        reqBody.Name,
		OpenTime:    reqBody.OpenTime,
		CloseTime:   reqBody.CloseTime,
		Phone:       reqBody.Phone,
		OwnerID:     reqBody.OwnerID,
		Address:     addr.MapCreateRequestToEntity(reqBody.Address),
		Description: reqBody.Description,
		Media:       media.MapCreateRequestToEntities(reqBody.Media),
		SportTypes:  st.MapCreateRequestToEntities(reqBody.SportTypes),
	}
}

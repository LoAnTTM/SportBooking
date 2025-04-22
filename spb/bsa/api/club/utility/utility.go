package utility

import (
	addr "spb/bsa/api/address/utility"
	"spb/bsa/api/club/model"
	media "spb/bsa/api/media/utility"
	st "spb/bsa/api/sport_type/utility"
	tb "spb/bsa/pkg/entities"
	"spb/bsa/pkg/utils"
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
		NameEn:      utils.VietNameseCharacterToASCII(reqBody.Name),
		Slug:        utils.CreateSlug(reqBody.Name),
		Phone:       reqBody.Phone,
		OwnerID:     reqBody.OwnerID,
		Description: reqBody.Description,
		Address:     addr.MapCreateRequestToEntity(reqBody.Address),
		SportTypes:  st.MapIdsToEntities(reqBody.SportTypes),
	}
}

func MapUpdateRequestToEntity(reqBody *model.UpdateClubRequest) map[string]interface{} {
	clubUpdate := make(map[string]interface{})

	if reqBody.Name != "" {
		clubUpdate["name"] = reqBody.Name
		clubUpdate["name_en"] = utils.VietNameseCharacterToASCII(reqBody.Name)
		clubUpdate["slug"] = utils.CreateSlug(reqBody.Name)
	}
	if reqBody.Phone != "" {
		clubUpdate["phone"] = reqBody.Phone
	}
	if reqBody.Description != "" {
		clubUpdate["description"] = reqBody.Description
	}

	return clubUpdate
}

func MapEntitiesToResponse(clubs []*tb.Club, total int64, reqBody *model.GetClubsRequest) *model.ClubsResponse {
	clubsResponse := &model.ClubsResponse{
		Clubs: make([]*model.ClubResponse, len(clubs)),
	}

	for i, club := range clubs {
		clubsResponse.Clubs[i] = MapEntityToResponse(club)
	}
	// Set pagination
	clubsResponse.Total = uint(len(clubsResponse.Clubs))
	clubsResponse.Pagination = reqBody.Pagination
	clubsResponse.Pagination.SetNewPagination(utils.SafeInt64ToInt(total))

	return clubsResponse
}

package model

import (
	addressModel "spb/bsa/api/address/model"
	mediaModel "spb/bsa/api/media/model"
	sportType "spb/bsa/api/sport_type/model"
)

type CreateClubRequest struct {
	Name        string                              `json:"name" validate:"required"`
	OpenTime    string                              `json:"open_time" validate:"yy:mm,required"`
	CloseTime   string                              `json:"close_time" validate:"yy:mm,required"`
	Phone       string                              `json:"phone" validate:"required,e164"`
	OwnerID     string                              `json:"owner_id" validate:"required,type=uuid"`
	Address     *addressModel.CreateAddressRequest  `json:"address" validate:"required"`
	Description string                              `json:"description"`
	Media       []*mediaModel.CreateMediaRequest    `json:"media" validate:"required"`
	SportTypes  []*sportType.CreateSportTypeRequest `json:"sport_types" validate:"required"`
}

type UpdateClubRequest struct {
	Name        string                              `json:"name"`
	OpenTime    string                              `json:"open_time"`
	CloseTime   string                              `json:"close_time"`
	Phone       string                              `json:"phone"`
	Address     *addressModel.UpdateAddressRequest  `json:"address"`
	Description string                              `json:"description"`
	Media       []*mediaModel.UpdateMediaRequest    `json:"media"`
	SportTypes  []*sportType.UpdateSportTypeRequest `json:"sport_types"`
}

type GetClubRequest struct {
	Query string `json:"query" validate:"max=255,required"`
}

type ClubResponse struct {
	ClubID      string                         `json:"id"`
	Name        string                         `json:"name"`
	OpenTime    string                         `json:"open_time"`
	CloseTime   string                         `json:"close_time"`
	Phone       string                         `json:"phone"`
	OwnerID     string                         `json:"owner_id"`
	Address     *addressModel.AddressResponse  `json:"address"`
	Description string                         `json:"description"`
	Media       []*mediaModel.MediaResponse    `json:"media"`
	SportTypes  []*sportType.SportTypeResponse `json:"sport_types"`
}

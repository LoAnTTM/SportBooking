package entities

var ClubMemberTN = "club_member"

type ClubMember struct {
	Base
	MemberID string `gorm:"type:uuid;not null" json:"member_id"`
	Member   User   `gorm:"foreignKey:MemberID" json:"member"`
	ClubID   string `gorm:"type:uuid;not null" json:"club_id"`
	Club     Club   `gorm:"foreignKey:ClubID" json:"club"`
}

func (ClubMember) TableName() string {
	return ClubMemberTN
}

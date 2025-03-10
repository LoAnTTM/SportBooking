package service

import tb "spb/bsa/pkg/entities"

func (s *Service) GetByRole(roleID string) ([]tb.Permission, error) {
	var permissions []tb.Permission

	err := s.db.Model(&tb.Permission{}).
		Joins("join role_permissions rp on rp.permission_id = permission.id").
		Where("rp.role_id = ?", roleID).
		Find(&permissions).Error
	if err != nil {
		return nil, err
	}
	return permissions, nil
}

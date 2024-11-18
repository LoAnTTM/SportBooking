#!/usr/bin/env bash

TABLES=(
	"public.address"
	"public.club"
	"public.club_media"
	"public.club_member"
	"public.club_payment_infos"
	"public.club_sporttype"
	"public.location"
	"public.media"
	"public.metadata"
	"public.notification"
	"public.notification_type"
	"public.order"
	"public.payment_info"
	"public.payment_method"
	"public.payments"
	"public.permission"
	"public.role"
	"public.role_permissions"
	"public.spatial_ref_sys"
	"public.sport_type"
	"public.transactions"
	"public.unit"
	"public.unit_media"
	"public.unit_price"
	"public.unit_service"
	"public.unit_sporttype"
	"public.user"
	"public.webhooks"
	"public.progress"
	"public.status"
	"public.platform"
)

USERNAME="spb_user"
DATABASE="spb_database"

TABLE_OPTIONS=""
for table in "${TABLES[@]}"; do 
	TABLE_OPTIONS="$TABLE_OPTIONS -t $table"
done

dest="./migrates/dump-spb_database-$(date +%Y%m%d%H%M).sql"
touch $dest
docker exec -it spb_database pg_dump -U $USERNAME -d $DATABASE $TABLE_OPTIONS > $dest
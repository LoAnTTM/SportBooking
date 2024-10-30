#!/usr/bin/env bash

docker exec -it spb_database pg_dump -U spb_user -d spb_database > ./migrates/dump-spb_database-$(date +%Y%m%d%H%M).sql
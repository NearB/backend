docker create --name stores_db__data_volume -v /data/db mongo:3.2.7 '/bin/true'
docker create --name products_db__data_volume -v /data/db mongo:3.2.7 '/bin/true'
docker create --name ads_db__data_volume -v /data/db mongo:3.2.7 '/bin/true'
docker create --name users_db__data_volume -v /data/db mongo:3.2.7 '/bin/true'
docker create --name find__data_volume -v /go/src/app/data sebastianbogado/find '/bin/true'

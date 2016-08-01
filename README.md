# Near.B Backend services
 
## Requirements

- [Docker](https://www.docker.com/products/overview#/install_the_platform)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/en/download/)
- [fuge](http://fuge.io/)


## First time setup

Each storage is inside its docker image, so the first time you'll have to run

`docker-compose -f compose-dev.yml pull`

To create the data volumes, run

```
docker create --name stores_db__data_volume -v /data/db mongo:3.2.7 '/bin/true'
docker create --name find__data_volume -v /go/src/app/data sebastianbogado/find '/bin/true'
```


## Run the app
```
fuge shell ./compose-dev.yml
fuge> start
```


### Checking if everything worked

Go [here](http://localhost:10000/api/location/list). 

If everything was fine, the proxy at port 10000 is redirecting the 
request to the Mobile API, which is interacting with the Location API,
which in turns interacts with the Stores API, who is actually gathering
data from a db


### Troubleshooting

#### Issues with MongoDb containers

##### 1. Unclean shutdown

> [initandlisten] Detected unclean shutdown - /data/db/mongod.lock is not empty.

Might be a cleaner way, but as a quick fix: rebuild the images. For example, with stores_db

```
docker-compose -f compose-dev.yml rm -v stores_db
docker-compose -f compose-dev.yml pull stores_db
```


##### 2. Address in use

> [stores_db - 21479]: docker: Error response from daemon: driver failed programming external connectivity on endpoint drunk_kirch (eaea99501446f0f169353e39e82bb5e06799175786282217674a0a13efb76a05): Bind for 0.0.0.0:11000 failed: port is already allocated.

`fuge` was not properly terminated, and some containers were still running.

Run `docker ps` and look for the container bound to that port and then 
`docker stop <container_id>`. For instance: 

```
$ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                      NAMES
31c0b73e4caf        mongo:3.2.7         "/entrypoint.sh mongo"   2 minutes ago       Up 2 minutes        0.0.0.0:11000->27017/tcp   backstabbing_noyce
9aa4db5c5c1f        0303bc912b57        "/entrypoint.sh tail "   33 minutes ago      Up 33 minutes       27017/tcp                  prickly_goldstine

$ docker stop 31c0b73e4caf
```

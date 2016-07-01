# Near.B Backend services
 
## Requirements

- [Docker](https://www.docker.com/products/overview#/install_the_platform)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/en/download/)
- [fuge](http://fuge.io/)


## First time setup

Each storage is inside its docker image, so the first time you'll have to run

`docker-compose pull`

## Run the app
```
fuge shell ./compose-dev.yml
fuge> start
```


### Checking if everything worked

Go [here](http://localhost:10000/api/location/list). 

If everything was fine, the proxy at port 10000 is redirecting the 
request to the the Mobile API, which is interacting with the Location API,
which in turns interacts with the Stores API

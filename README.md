# Near.B Backend services
 
## Requirements

[Docker](https://www.docker.com/products/overview#/install_the_platform)
[Node.js](https://nodejs.org/en/download/)
[fuge](http://fuge.io/)


## Run the app
`fuge shell ./compose-dev.yml`
`fuge> start`


### Checking if everything worked

Go [here](http://localhost:20000/api/location/list)
If everything was fine, the Mobile API is interacting with the Location API,
which in turns interacts with the Stores API

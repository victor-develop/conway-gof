# Multi-player Conway's Game of Life

This is a web-based game: Conway's Game of Life, developed as the specification at https://hackmd.io/s/SyXikdg_g#full-stack--backend-developer--eng-manager

### Prerequisites

To run this game locally, you should have Docker installed. You can download and install from https://www.docker.com/get-docker

At the time of development I am using version `17.09.0-ce-win33`


## Getting Started

Execute the following commands for the first time of use

```sh
 // clone repository
 git clone ...
 // start docker
 docker-compose -f docker-compose.ini.yml up
```

This will install node modules for your folder and exit process when finished.

Then you type 

```sh
docker-compose up
```

Now you can go to `localhost:8080` and start playing the game. To try out multi-players just open another browser window

### local development
Enter docker with

```sh
docker-compose exec conway /bin/bash
cd solution
```
And then, in the bash shell, you may:

 - lint the code style: `npm run lint`
 - run tests: `npm run test`
 - have automated monitor on .ts file changes and restart server: `npm run dev`

### deploy to Heroku

You must have heroku CLI installed.

```sh
heroku create
heroku push master
```
And then check out the web url provided in the console.

## Built With

* [express](https://expressjs.com/) - Web server
* [socketIo](https://socket.io/) - widely used lib for real time connection
* [Vue](https://vuejs.org/) - Front end framework
* [Typescript](https://www.typescriptlang.org/index.html)

I picked these into the tech stack since each item above has its pretty big communities. Supports and documentation can be searched online easily. 

## Versioning

  [SemVer](http://semver.org/) is used for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Design Decisions

Why do i curry sometimes curry a class constructor with a create() method?
 - Some params are needed due to dependency injection, some are needed due to business logic. Use curry to separate functional dependencies(e.g. logger) and business-logic dependencies for reusability.

## TODOs

__common/src/api/__`apiEvents` contains keys representing client->server and server->client, better sepearate them in later versions.

## Additional Code naming convention

Type and interface should be prepended a `I`, i.e. `IFoo`, `IBar`, etc.

All follows airbnb-base lint standard as specified in `tslint.json`, and some extra stuff:

 - For class member assessors like getter/setter, e.g. class `Foo` has a private member `bar`, then its getter should has its class name prepended with first letter lowercased, i.e. `fooBar` as its getter name

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

Credits to below, where I adapted/learnt from their code for

Drawing game board
 - Codebyte: https://coderbyte.com/tutorial/create-a-simple-chessboard-using-html-css-and-jquery

Reference for setting up the project structure and environment
* Rising Stack: https://blog.risingstack.com/building-a-node-js-app-with-typescript-tutorial/

* luixaviles: 
https://github.com/luixaviles/socket-io-typescript-chat

Readme Template
* PurpleBooth: https://gist.github.com/PurpleBooth/109311bb0361f32d87a2
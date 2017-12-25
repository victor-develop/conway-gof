# Multi-player Conway's Game of Life

This is a web-based game: Conway's Game of Life, developed as the specification at https://hackmd.io/s/SyXikdg_g#full-stack--backend-developer--eng-manager

## Built With

* [express](https://expressjs.com/) - Web server
* [socketIo](https://socket.io/) - widely used lib for real time connection
* [Vue](https://vuejs.org/) - Front end framework
* [Typescript](https://www.typescriptlang.org/index.html)
* [Webpack](https://webpack.js.org/) - front end assets bundling

## deploy to Heroku

#### The Automated way

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

#### The manual way

You must have a heroku account and a heroku CLI installed. See https://devcenter.heroku.com/articles/heroku-cli

```sh
git clone https://github.com/victor-develop/conway-gof.git
cd conway-gof
heroku create
heroku push master
```
And then check out the web url provided in the console.

## Local-machine development

### Prerequisites

To run this game locally, you should have Docker installed. You can download and install from https://www.docker.com/get-docker

At the time of development I am using version `17.09.0` on Windows machine. Docker should work aross different platforms


### Getting Started

#### The first time of use

- Clone the repository and enter the directory root

  ```sh
  git clone https://github.com/victor-develop/conway-gof.git
  cd conway-gof
  ```
- Run Docker

  ```sh
    docker-compose up -d
  ```
- Enter the bash of the docker image

  ```sh
    docker-compose exec conway /bin/bash
  ```
- You shall be at the /home/dev now. The `package.json` at root directory is __NOT__ the package.json for this project. This is just a file created for Heroku's requirement to deploy the app successfully. Instead, you should go to `solution` folder to see the real package.json, where the project source code stays, like below.

- Install npm dependencies

  ```sh
    cd solution
    npm install
  ```
- boost the server

  ```sh
    // still at `solution` directory
    npm run dev
  ```

  Now you can go to `localhost:8080` and start playing the game. To try out multi-players just open another browser window

#### local development
Enter the shell with

```sh
docker-compose exec conway /bin/bash
cd solution
```
And then, in the bash shell, you may:
 - __run tests__: 

  ```sh
    npm run test
  ```
 - __development with live-reload server__: 
 
  ```sh
    npm run dev
  ```


## Implementation Details

#### Directory Structure

The source code is mostly under `./solution/ts_code/`, divided into 3 major parts: __client__, __common__, and __server__, which will be transpiled into JS under `./solution/dist/` with corresponding folder structure. Webpack will also transplie and place a bundled front-end `base.bundle.js` into `dist/client/static`.  __HOWEVER__, The `./solution/dist/client/static` is __NOT only__ a folder for transpliled content, but also some static assets like __index.html, .js, .css__ and so on. These are legacy files which are not yet integrated into the bundling process. It is not a good practice to mix genereted files and source files together, so these static assests may probably be moved out from `dist` and get packed into webpack bundle sometime later.

```sh

./                          # config of docker, webpack, nodemon, typescript, tslint, etc.
├─.vscode                   # vscode debug config
├─docker
│  └─docker-image
└─solution                  # source code and compiled/transpiled files
    ├─dist                  # mainly contains files transpiled from ./solution/ts_code
    │  ├─client
    │  │  ├─static          # NOTE: The 'static' files contains static content which need not transpliling
    │  ├─common
    │  └─server
    ├─node_modules
    └─ts_code               # Typescript source code
        ├─client            # client-side code, running in browsers
        │  ├─src
        │  └─tests
        ├─common            # reusable components/classes for both front and back ends
        │  ├─src
        │  └─tests
        └─server            # server-side code, running in Node.js
            ├─src
            │  ├─config     # project configurations
            └─tests

```

#### Application Architecture

This is not a strict UML but a rough conceptual overview of the whole application.

![conway-gof overview](https://www.draw.io/?lightbox=1&target=blank&highlight=000000&edit=_blank&layers=1&nav=1&title=conway-gof-overview#R7Vttc9o4EP41fCxjW7aBj4EmuczkJjdD59p%2BVGxh1NgWI8u89NefZEtgIzmlCYZLR8wkWLuykPbZZ70rwQDMsu09havl3yRG6cBz4u0AfB54njsKff4mJLtaMvHCWpBQHMtOB8Ec%2F0RS6EhpiWNUtDoyQlKGV21hRPIcRawlg5SSTbvbgqTtT13BBGmCeQRTXfoVx2wppW44OSj%2BQjhZqo8OA6%2FWPMPoJaGkzOUHDjywqF61OoNqMLnSYgljsmmIwO0AzCghrL7KtjOUCuMqu9X33XVo9xOnKGen3OCB%2Bo41TEukplxNjO2UNarlIHGDMwDTzRIzNF%2FBSGg3HH8uW7Is5S2XX%2B4XJPoWjJIXNCMpodVQwKlee40yLl%2F2dIHTtNHzrnpxeUJhjPlqlC4nORLdSc7uYIZT4WKPZYRjyGc9I3lBUqWXjuWGsn00hG4rab41ogxtGyJpu3tEMsTojndRWoWjdPTAkUNsGm7jAWnkZdNllK9D6avJfvADXPxCItYB99iid0b0vLGjoef7jgG8sft%2B8EINu1kqTKUhyFfDjmBqIaNs2oBAimCKk5w3Iz4s4vKpsA3mce5GKjIcx5XBTX7R9pyWa%2Fxf8ANt%2FHwDfgb4vDNQz8A8cNMB4MGQrqXgEYR%2Bm4JgbAqgBgzDM2AIfA0qFPNEQDblKts0aCCFtph9E%2BJhIFvfpeYHYmwnjQdLRriIULYkCclh%2BkjIysjjbnjdnvEqSEkjaQGZ4jBIE6T4Iu0kjPMqqBSlkOF1O4t6D0KTbpbNGWTIUu10qnmjE6gG%2BqJa0BPVuD3orqESze9ygI9MQ9cz8DC4Fg%2FVbNpEvIcZullhS8LTSeh7V3zeuYZwasuFk7ELRkfppqFc4IvWsTtLuaCcogHeHFE%2Bew1CWy90ATi%2BXr2wn60WQW34fDuCly0Xwp5ymI%2Bcp6hHSCtPGV0rT1GzabCsQIznKCJU4shy7Te4NvJO4JopXJ6Da6rkbAD5b2nh%2B61yrw1f4OkPO1cx9ezwBXqyQqIXxB6IMIXdJntn2WAGsy8ujrrAfLIYvj2eGjHsLZ7ak6L3YDee%2FLr088O%2BSj9gPGwQtcOUQBpbEp4O5MQ9SmqcCwZSoO%2B%2FzEiWkVxD0JbwXfg57QfhJUt431jCP9S9LAVPPvJz%2FCty0NcrxOFw%2BMSWYiMthJmAJn8uVtVaw1SwMMZrfpmIy8%2BQCZN9oTAvFt138Ek0bjKM8%2FT8A0Ws6Or%2FpzmT258zucc7QiZn6utUyx9pWNlTrdd2i3xZ1jd3i8DVdot8fZPh4XbN5z8tiz%2BPhBdMqi65UwT06rTC8DbDjGdAwAL5diAvWqL64%2F6DqR%2FuBUL7yRk63j7A%2FoMo5rMWWfPHD7SBHmj98GqBVt8OfHgkSWI4vLTsfCVxvubpl69%2FX%2FW5zHdQL14thKdDaIywfaWrgf5lf26ADRQTrE%2BiHbLg%2Fx7xQlx%2F4n9Pa3FwhjYayHaHorMiCVoIu6Zvibjn2aLgzcNPRSpd4wc54PY%2F)

## Versioning

  [SemVer](http://semver.org/) is used for versioning. 

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
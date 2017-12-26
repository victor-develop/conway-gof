# Multi-player Conway's Game of Life

This is a web-based game: Conway's Game of Life, developed as the specification at https://hackmd.io/s/SyXikdg_g#full-stack--backend-developer--eng-manager

## Built With

* [express](https://expressjs.com/) - Web server
* [socketIo](https://socket.io/) - widely used lib for real time connection
* [Vue](https://vuejs.org/) - Front end framework
* [Typescript](https://www.typescriptlang.org/index.html)
* [mocha](https://mochajs.org/) - testing framework
* [Webpack](https://webpack.js.org/) - front end assets bundling

## Deploy to Heroku

#### The Automated way

A heroku account is required.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

#### The Manual way

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
- You shall be at the /home/dev now. The `package.json` at root directory is __NOT__ the package.json for this project. This is just a file created for Heroku's requirement to deploy the app successfully. Instead, you should go to `solution` folder to see the real package.json, where the project source code stays.

- Install npm dependencies

  ```sh
    cd solution
    npm install
  ```
- start the server

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

  While the test results will display at the standard output, the detailed operational logs during the test can be found at `./solution/dist/server/tests/ouput_xxxxx.txt`, note that althought the output is placed under `./solution/dist/server/tests`, it contains all test logs produced regardless of front-end/back-end when you run `npm run test`

 - __development with live-reload server__: 
 
  ```sh
    npm run dev
  ```


## Implementation Details

#### Directory Structure

The source code is mostly under `./solution/ts_code/`, divided into 3 major parts: __client__, __common__, and __server__, which will be transpiled into JS under `./solution/dist/` with corresponding folder structure.

##### The `dist/client/static`

Webpack will also transplie and place a bundled front-end `base.bundle.js` into `dist/client/static`.  __HOWEVER__, The `./solution/dist/client/static` is __NOT only__ a folder for transpliled content, but also some static assets like __index.html, .js, .css__ and so on. These are legacy files which are not yet integrated into the bundling process. It is not a good practice to mix genereted files and source files together, so these static assests may probably be moved out from `dist` and get packed into webpack bundle sometime later.

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

![conway gof overview](https://www.draw.io/?lightbox=1&target=blank&highlight=000000&edit=_blank&layers=1&nav=1&title=conway-gof-overview#R7Vttc9o4EP41fCxjW7aBj4EmuczkJjdD59p%2BVGxh1NgWI8u89NefZEtgIzmlCYZLR8wkWLuykPbZZ70rwQDMsu09havl3yRG6cBz4u0AfB54njsKff4mJLtaMvHCWpBQHMtOB8Ec%2F0RS6EhpiWNUtDoyQlKGV21hRPIcRawlg5SSTbvbgqTtT13BBGmCeQRTXfoVx2wppW44OSj%2BQjhZqo8OA6%2FWPMPoJaGkzOUHDjywqF61OoNqMLnSYgljsmmIwO0AzCghrL7KtjOUCuMqu9X33XVo9xOnKGen3OCB%2Bo41TEukplxNjO2UNarlIHGDMwDTzRIzNF%2FBSGg3HH8uW7Is5S2XX%2B4XJPoWjJIXNCMpodVQwKlee40yLl%2F2dIHTtNHzrnpxeUJhjPlqlC4nORLdSc7uYIZT4WKPZYRjyGc9I3lBUqWXjuWGsn00hG4rab41ogxtGyJpu3tEMsTojndRWoWjdPTAkUNsGm7jAWnkZdNllK9D6avJfvADXPxCItYB99iid0b0vLGjoef7jgG8sft%2B8EINu1kqTKUhyFfDjmBqIaNs2oBAimCKk5w3Iz4s4vKpsA3mce5GKjIcx5XBTX7R9pyWa%2Fxf8ANt%2FHwDfgb4vDNQz8A8cNMB4MGQrqXgEYR%2Bm4JgbAqgBgzDM2AIfA0qFPNEQDblKts0aCCFtph9E%2BJhIFvfpeYHYmwnjQdLRriIULYkCclh%2BkjIysjjbnjdnvEqSEkjaQGZ4jBIE6T4Iu0kjPMqqBSlkOF1O4t6D0KTbpbNGWTIUu10qnmjE6gG%2BqJa0BPVuD3orqESze9ygI9MQ9cz8DC4Fg%2FVbNpEvIcZullhS8LTSeh7V3zeuYZwasuFk7ELRkfppqFc4IvWsTtLuaCcogHeHFE%2Bew1CWy90ATi%2BXr2wn60WQW34fDuCly0Xwp5ymI%2Bcp6hHSCtPGV0rT1GzabCsQIznKCJU4shy7Te4NvJO4JopXJ6Da6rkbAD5b2nh%2B61yrw1f4OkPO1cx9ezwBXqyQqIXxB6IMIXdJntn2WAGsy8ujrrAfLIYvj2eGjHsLZ7ak6L3YDee%2FLr088O%2BSj9gPGwQtcOUQBpbEp4O5MQ9SmqcCwZSoO%2B%2FzEiWkVxD0JbwXfg57QfhJUt431jCP9S9LAVPPvJz%2FCty0NcrxOFw%2BMSWYiMthJmAJn8uVtVaw1SwMMZrfpmIy8%2BQCZN9oTAvFt138Ek0bjKM8%2FT8A0Ws6Or%2FpzmT258zucc7QiZn6utUyx9pWNlTrdd2i3xZ1jd3i8DVdot8fZPh4XbN5z8tiz%2BPhBdMqi65UwT06rTC8DbDjGdAwAL5diAvWqL64%2F6DqR%2FuBUL7yRk63j7A%2FoMo5rMWWfPHD7SBHmj98GqBVt8OfHgkSWI4vLTsfCVxvubpl69%2FX%2FW5zHdQL14thKdDaIywfaWrgf5lf26ADRQTrE%2BiHbLg%2Fx7xQlx%2F4n9Pa3FwhjYayHaHorMiCVoIu6Zvibjn2aLgzcNPRSpd4wc54PY%2F)

As in the diagram, 
  - `common` includes data models, interfaces, events, and utitlities, e.g. logger that are shared by both front&back ends.
  - `client` contains front end logic. __Vue__ is used as the reactive presenter of __:ClientState__, which is part of __:Client__, __:GameApi__ takes care of communication with server, and coordinates with __:Client__ through events.
  - `server` 's main component is the __:Game__ instance, the function __setApiService__ handles communication with clients and manipulate the __:Game__ instance accordingly

The real time connection is currently implemented with __SocketIO__, but can also be replaced with other solutions if needed in the future, by changing the __GameApi__ at the clien-side and __setApiService__ at the server-side, without affecting other components.

#### Core components

##### GameBoard
GameBoard is esstially a list of __alive__ cells (pratically, arranged in hash map but not list) plus the world border: width and height. Dead cells are not stored, but they will be stored once they come back to life according to reproduction rule. Cells are arranged in (0,0)-started 2-d grid plain.

![game models](https://www.draw.io/?lightbox=1&highlight=000000&edit=_blank&layers=1&nav=1&page=4&title=conway-gof-overview#R%3Cmxfile%3E%3Cdiagram%20id%3D%221002ebb3-85d6-c19d-d57d-8200da7cb991%22%20name%3D%22overview%22%3E7Vttb9o6FP41fBxKYifAx8LarVKnTmK69%2B6jm5jgNYmRMW%2F79dcONiTY2WAl6YSM1BIfv8Q%2Bz3lOzrFDD0zy7SeGFvMvNMFZL%2FCSbQ987AWBD4OB%2BJKS3V4yGIR7QcpIohodBVPyEyuhp6QrkuBlrSGnNONkURfGtChwzGsyxBjd1JvNaFa%2F6wKl2BBMY5SZ0n9JwudK6kejY8VnTNK5vnUUBvuaFxS%2FpoyuCnXDXgBm5WdfnSM9mFrpco4SuqmIwH0PTBilfH%2BVbyc4k8rVetv3e2ioPUyc4YKf0yEA%2Bx5rlK2wnnI5Mb7T2iiXg2UHrwfGmznheLpAsazdCPyFbM7zTJR8cXlYkGy75Iy%2B4gnNKCuHAl75OdRo5Yplj2ckyyotH8qPkKcMJUSsRtcVtMCyOS34A8pJJk3saRWTBIlZT2ixpJmuV4blR6p8MoRaOWYcbxvV5x9AEdaOaY4524kmuoPGURl66KkhNhWzCYBS8rxqMtrWkbLV9DD4ES5xoRBrgHvo0LsiesHQM9CD0LOAN%2FTfDl5kYDfJpKoMBMUC%2BQlMNWS0TisQKBHKSFqIYiyGxUI%2Bluoiws%2FdqYqcJEmpcJtd1C2nZhp%2FC36gjh%2B04GeBL7gC9SzMA3cNAB4V6TsKnkAI6xQEQ5sDtWAYXQFDAA2ocCICAVVUq6zToIIU3hL%2BnxT3Q1X6rmp%2BYM53SnloxakQUcbnNKUFyp4oXVh53Ayvf0285BJ%2FjZbQCF2xWLVSMQ9HLMWaQNAOKsMZ4mRdH%2F4tCI2aWTbliGNHtfOpFgzOoBpoi2phS1QTi2e7SpUsflcD3BQN%2FcDCw7AjHuqb14n4CeX4bkEcCc8nIQze8XnnW9ypSxfOxi4cnISblnRBLNrE7irpgjaKCnhTzMSCDAhdvtAE4PD98gU9W9ODOvd5AYIj%2BHv36UctxTBRSzHMTcUp%2BplSi1MGHcUp%2BuYVli0xFzGKdJUkdly7gGuDk90VK9ds7vIaXAugAeQ%2FKwffReleHb4wMB92vj6ouTp8oRms0PgV80cqVeG2yd6YNtjBbIuLgyYwnx2Gf%2B5PrRi25k%2FdSdFbsBuOfp%2F6wait1A9YDxtk7jCmiCWOhOcDOfJPghqvQ0cKzP2XCc1zWhgIuhS%2BCT%2Bv%2FiDsMoWH1hT%2Bcd%2FKUfDsIz8PviMHoZkh9vv9Zz6XG2kRyiU0xctyUa41yiQLE7IWl6m8%2FIi4VNk3horlrLmHmESlk2Wc55cfOObLpva3Zkx%2Be8bkD88wprZOteDAwMqdal20WwRVnl%2FdLQJd7RZBc5Ph8X4tpjteLW%2BPhB0GVV3uFAEzOy0xvM8JFxEQcED%2BOZCdpqhw2L4zhdFBIGs%2FeH0vODjYr5gRMWsZNd%2Bgow1NRwujrhytuR34%2BETT1HJ46dj5i8D5NNbp8uUBaL6v%2BrIqdshMXh2E50No9bBthauh%2BbK%2FUMAGyQnuT6I9OhP%2FnshMXn8Qf89reXCGNwbIboeiMSMJawj7trdE%2FJa2KEJLRCuRdS9LXoii8aKBb9ujCK%2FCU1E8%2FuCnrKv8rArc%2Fw8%3D%3C%2Fdiagram%3E%3Cdiagram%20id%3D%22ba7a88fb-26ae-3efb-303b-872179c9e311%22%20name%3D%22Game%22%3E7Vrbbts4EP0aAe1DA0mUFPvRl7hbIAW8TYHuPtISbXFLiQZF3%2Fr1O5RIWTenduK4i66MABGHQ4rkOTOcIWWhSbL%2FKPA6%2FswjwizXjvYWmlqu67gOgn9KcigkgT8sBCtBI610FDzRH0QLbS3d0IhkNUXJOZN0XReGPE1JKGsyLATf1dWWnNXfusYr0hI8hZi1pd9oJGMtdYLhseIPQlexeXXgu0XNAoffV4JvUv1Cy0XL%2FFdUJ9h0pmeaxTjiu4oIPVhoIjiXxVOynxCmFtesW9FudqK2HLggqTyngRnHFrONnjzZcrYls00aWm7AoJdxtsYpPK%2FUc7sWOq8qdDWy0OgSbdd%2Bd4H6gmMRvdlgPuKEjC98w3tLLesFA4JlD3CyhmejVJTSRbauNLrKcHPWyYOhes5VotjgQPUuppI8rXGoandg3CCLZcJ0dclWWxWk4N%2FJhDMu8q6Qnf%2FKGmM5wOnxkjJW0ZzlPzVdgSMKVDV1KU%2BJUuepnOGEMuU%2FHjchjTCMesLTjDNTr72GE%2BhyowtNayIk2Z%2B0Dae0OHBlhCdEigOo6AaBcUcHY%2F9eUd4dfQIaaJ244g4CLcPaDa3Kro%2BWCA%2FaGE8Ypt8yzC68V0R%2BwWnEkzmWkoj0qnYQ0e1zHfRG%2BkIjPQ8rENcA6A33xYY7RLczXOR0GG4DO5JGIxWmQCmiOOFp9DWmqdpd02hGmUENSnqxXK%2BB55kQOhdiMuzGhOyp%2FEux587Xpb81lwARcSiq7n1TNpXFvEnUCrYaQMLa8I0IST0kkViAd9OL6nUDXgHUMeAJwrCk2%2Fo7uxDV3c05hdEcyYMa5PFQvYtirLpVNbRqdITuGx3ZDXYVE2x1BMzAh4raWilkpwc8sOvvQfZPhuU%2Fow4PxfuPXC%2BX%2Bzz6u78h%2FQ3JnTvbua%2Bx%2FM4eulUDqZrHXWkQcyIorCERrzMM%2F9cahtvgs%2B%2B9zDC8pmEMgzcxDL%2FxHlitZ8fV1HfcK5uG1zYNNFKxS8tCsh1NGC631Cddo%2FiMGV2BrUxDoIoi1FhtlRRy15GukFxt%2FmFMWfSID3yjmJJJyEtNaRxzQX9At%2FhoT1gYI3CDmsaTaqlpK0gGOnPDUqch%2Boz3NcVHnEktCDljeJ3RRTmNBDCm6ZhLyRMTl%2BhJz%2Boxh86f%2F29BjDNoZh9OK4gpA5a4dhjRsMsXRTHt9OMDFP%2Fhiz83REkgPLfVKYCkPLX8seVPWySGucsWUmaNK5BokSE2I0t5ktYQKIc0XT3mOlPvKPmiF0CJOLRdspwqMY0iorYWwSWWuOCfYol2HjBQNfgxrONEOWw1jQmUnWMZ%2FpS6kIoBUmCa40eA3DuiCH4xX84ixynHbnxZcB4Z3OD1XDBnW7UtXZ3SkC3J11Bx4dODKow3WU%2BDG9LAQHMLGqDg55EdozmGHVHYxUAnAFm%2BbhrZrwr46QenhT5qo486kGZ4QdicZzT3WGgqCt0GA%2F6LIN8PzgN5cAWM70%2BYekp2c4YPRLx73xv4DbEf3NDPo8EJ8AVJYKl7%2FH8B%2Fo5zSw8%2F7CTAxLVG9jpHf45lGKtWWc%2BD2%2FIAnbkJXIMHXvtS8JNKUyEXlH2u2ueq7QP3xtGQO%2BzIVZ2uXNW4t1fRtevEfbxZR8DWkSzSk01K95J2nLT0TusVTsuzu2nxTJLaxYKr%2BKzOyLXYtUyKWkQw%2FWnFzYnQlaa%2BFRH89uYFRCjun3MaVC6LewrcjAJdSeyb%2BYIz7qD6k4o3ANmx21%2FIdKJ8haMK%2F3e8Zy8vGq3aJaNvXXJnWLsf9LsBu8H9IDLliy%2FOh169I7txA3%2Bt%2B8FB94BP3lu%2BUt%2FxvAbBL7pPhOLxu9BC%2Ffj1LXr4Fw%3D%3D%3C%2Fdiagram%3E%3Cdiagram%20id%3D%223c369dc2-d054-91be-35a6-1d78f60ecb7c%22%20name%3D%22Gameboard%20Update%22%3E7Vnfb6Q2EP5rVmofigDD%2FnhM9i53D1cpUh7aPnrBAd%2BBzRmT3e1f3zHYYC9wjbJETXUhSmKPB9sz3%2FibWe8K7cvTJ4Gr%2FHeekmIV%2BulphT6swjDYIAT%2FlOTcSXZR0AkyQVOtNAge6N9EC30tbWhKakdRcl5IWrnChDNGEunIsBD86Ko98sJdtcIZGQkeElyMpX%2FQVOZaGqx3w8BnQrPcLL2Ow27kgJNvmeAN0wuuQvTYPt1wic1k2tI6xyk%2FWiL0cYX2gnPZtcrTnhTKucZv3Xt3M6P9xgVh8jkvxN0LT7hoiNlxuy95Ns5Q5lRajQhJTlMQ4INR98dbCHrDIGIIL4kUZ1DRE8U7%2FYoOFmT6x8H1kYmM3Pa6r4VYw531cw8WQ0MbPe2AcOSAr%2FwAgu8NAUHoc0BuXcCKtyl9gmammk2VYklZpuIyV1oZLsmBY5EaZVjW0h%2F5tI0Qorbgw%2FAxp5I8VDhRo0c4UiDLZQlb%2FhBAs48RpVtLwb%2BRPS%2B4aKdCfvv0IyZeweG3j7QoLM279gF5JnBKAR0zxjgjSp0zeYdLWiggvjQJTTHses9ZzQszrs9qsNX9iylmw8QOh3g6HGy4%2FdCLI%2BtnPUZ%2FtwD46N%2BjXwqKWdba%2Fw6TdWo3XuQgFDtnOB6f4K2H%2FLG%2Bjeh2AUSjd0RfiiiKkOfH26D%2FeRuIbkcAkhSSte5q810%2BtSAE28X5Ty1vO3%2BpjhdD9yuR8qz9ihvJQcSFzHnGGS6%2BcF6ZMHgm8sGSUCojZ4HUopo3ItFaG10mYZERaaW2MdyCFJC8ntzZr0FoM5lC0Q3IfvkV%2FrSyNS7V6dLp0P8ECfO2S5izqTH4%2BU7ojyslFLqVUuSPTyVYPT6H6wXOYTBOlp7njdmVnOQFRg4sxqGW%2F7UIFzRj0E3AGwTkt8pXFIryGz1Q0jSdpW2XAZy4eBvg9SAY8IKJMncCu3CJIje6jkRPVPYcCu23Q6HRkhTaZbwrCFO%2Fes8prDIAv7k8tReIdpyt3xpAvRECny21SinU8%2BtEkbuOCbi7Z%2Boj9GP98Ep9Y%2FcQs52FQwT3Pn8eIW1HhEQVc0D%2FtwOuIZAhBJ540UjK2Sj%2BgSEq1ezoyk06VuhPUU2K67zXVZ17LGFd1kpCP%2Frp8lK8dav%2FnrPsvDT1CX6J%2BtB8iHsht%2F3XDLZoEXh1yTdzkuOLkxy9DoOF%2FvQ6SzHGxGWPua%2BpK8zMbU1V4DMRdetumeTqkgvmUX3Aifd3Ppf3PfYU73TzinSzdaMkjifYZqoKXoRt1v9rtpmpl%2FoCzwtNvadqvMDzUaj790RQ8JYqzFujXkhQM1cQ1xJUsPN21rPZuDxyWUMvxFcBiifXWYyvxrfzArOUlxYltRTV1jpT5OQfc8KURfDLyFHpt%2BSmoFO1Uv1OVK9IVBef%2BIIJokLrCaJ6yRcb0B2%2BNepibfhuDn38Bw%3D%3D%3C%2Fdiagram%3E%3Cdiagram%20id%3D%2275b3910a-fef7-363b-02b9-9b51502e72cc%22%20name%3D%22client%20server%20events%22%3E7VpLk9soEP41rt09bEoSkmwfPc5M9pCtmqrZqk2OjMTIbLBQITy28%2BsXEHog5EdsyU5V5ItFAy2gv%2F4aGk3Acr37xGC2%2BpvGiEw8J95NwMeJ57m%2BNxV%2FUrIvJNNpUAgShmPdqBa84O9ICx0t3eAY5UZDTinhODOFEU1TFHFDBhmjW7PZGyXmWzOYIEvwEkFiS%2F%2FFMV9pqRvO64q%2FEE5W5avDwCtqXmH0LWF0k%2BoXTjzwpn5F9RqWyvRM8xWM6bYhAo8TsGSU8uJpvVsiIhe3XLei39OB2mrgDKX8nA6g6PAOyUbPfQIWn%2BAaLTKsR8j35bKIwWbykak1f1jxNRElVzxuV5ijlwxGsnorQCFkkOAkFcVIDAUxIajm6sgCZ%2FQbWlJCmVIOHPWrasp1F%2BN5eMOENFo%2BqZ%2BQJwzGWGgv61KaItmcpvwJrjGR6Pu8iXAMxTyWNM0pKes15tyZLrdU6FVBjKPdwZV1K3sJR0B0jTjbiya6AxC6VRftA66nfWDbQFSoYbBqgKmUQQ3ipFJd21E8aFMeMKtjGQ%2FFAuK6qGepcIpibZGGOdEO8y%2BN56%2ByyYdAllIxki%2B6hyrUdf8hzvd6YeGGUyGijK9oQlNIPlOaaY3nmt79QVuGx2wpp3%2FckmK16IZFulWoaQeyBOlWBavZBmeIQI7fTfXXWC%2B0nDJHXDjkC2LvWAxw9Msr%2FHIe3tEvy8DYMK0k29Gi11jU9Zw7mnRuWRS9q4Ev6g0KpqmkoJzDV4LzlaDcQwZHO24Qs3va%2BjFUGosGsvAMuYBBqiSe4%2F%2BkePAHw0Mwc004BDYcvFlgwwH0AAfXuy7yVvH1gxtOzRgrYa0Fz4hhMTTp7ErDvUPvUWOeDr1XxFTd9ZliobGCgD8FBgS8EgKliiLU617N%2FXFL0bzseEhRsUGwFCmYVPM5Dzn2Xjwi0snkijEqXNGOEyZRdLFDA1u%2FFguEbmhazukICl0s4PcR551jUSFRIV%2FYEXL5v8li9TCGhOHA4Jh84HeFBH%2BgkFAdLy4LCSO3tyjZN3d7waXc7k9PKOqP2zvyLNGGsYLcTToYGf5spwamUwc3ZfjAsqjt5Wm8kNnIetYGMTcNd1vfbewyqy3lV63%2BXL82cyOg21INSwQd569SdiUjgLnpyNP2ue5sRmjl7KqQMAAj2EmeXws%2F9wKL65TuX6KlTQfnokVoauUdZoPBBbg2XMBiqc8HY%2FbomuzRPfP0HfcvR1ggIjDPcaQWHzJui29ACQey7JddGZwfbJq5efCzBSBv3ko3tOPGuZQCfFOROx%2BOUXwLelE3nfDiBHoQW6U7N7xfiyxqkZ6KI0gWumKN41ghrIuYzBORwUq9XQtdl2h0zUhSMkIDdH4H6Lw%2BiMPefsrbIbHIo%2FXOvQhq5QRuaT37GqhOD4VwLdcvfc0zNdGQSPvlGUzFcyKfI7Ee0qq6SrytWXtwOzAmkvpPJIkJWqgZLJEEZvbmYEwk9ZZI8p3pZVG7nUiyFPUYte3rxjqRlBG4R%2By3fKIuHguKGNNJl6aTQDC1XHuwdJJ%2F7MLgdEQoLC%2FIOVoVisfIcPtbZ%2FO%2BKXQ7IsNQt87%2BdVcM461zT7fOrTyke2FmaR46xxX1F1B8zyKerPDk3zOaY%2FnpSv7HGEZ%2BIIyUXUoe6DhXDBdG7HyS%2BpDXeZTBJLfsaB8OGcrxd%2FiqGkirZBJjakTBwyT4KI%2BFwtNzvYyNUyJBb7zjjMglC8hYFeE0%2BUdRwp%2F%2BpPuMd8p4A5wBTYcFHaZy%2BzkDimL9VXfhp%2FW38%2BDxfw%3D%3D%3C%2Fdiagram%3E%3Cdiagram%20id%3D%228b5b61a6-c1e7-9b1e-1007-a9f91635e7e3%22%20name%3D%22models%22%3E7ZpRc6IwEMc%2FjY93Q0DQPlZb25uxM53zZu45hQiZBuKEWPU%2B%2FW1CoiLQ0kptH3CcgWyWhOzvH7NBBt403d4JvEoeeETYwHWi7cC7GbgucpEHB2XZFZbAvyoMsaCRcToYFvQfMUbHWNc0InnJUXLOJF2VjSHPMhLKkg0LwTdltyVn5V5XOCYVwyLErGr9SyOZGCsKrg4V94TGie068N2i5gmHz7Hg68x0OHC9pf4U1Sm2jZmR5gmO%2BObI5N0OvKngXBZn6XZKmAqujVtx3ayhdn%2FjgmSyzQXmtl8wW5ux3%2BGUTDgWkblBubNRyTc0ZTiD0mTJM7kwNQjKmNE4g%2FMQuiUCDC9ESAoBvTYVkq%2FAGiaURXO842t1c7mEYNnSJOGC%2FoNmMTNtQrWQRhtuUPJYqCvB7IBVkBx8Hu2I0YnpAW9LjnOcS2MIOWN4ldOn%2FTBSLGKaTbiUPDVOdtAzytiUMy50LCxUqLcAtbMU%2FJkcuTn6s6%2BxYnJVCMsNzvQH7LHAEYUbt3UZ30d8hlPK1JSar0MaYaAz5VnO2Z5IESwUmPJJEwY1kCHbRrmgvQhhdhOeEil24GIu2Ot2Z4VvBLQ5miaB8UmOZwgyjthMzXjf9kGdcGIEWi9WryLWgTs5dH4Np9k6fQIBnkoXRiwrfGxkj0AYk5UzI0vZKOZ8hUOaxXPtczM8WH6bYSsTh2uXTAskoVFEMiVELrHEheqUNlacZlKHxZ%2FAF6I3dX76Ax9ufApldCjDV7kLqbhLgammRkDSG6JkXVFBK%2BRuPXKDGKZeK8LW7xzAQQNg209P%2BDMI%2By3ncBeERw2EQ3DLC8D3OE%2Bmutgz7ozxaHw5xsMaxickGdWEyqsi%2BhDGFIDoFdBw%2B6Ow3vxAFbZela1Xw5HhJ8IeeU4l5ap9Ufie8P0ChMgZtmM4Ph%2FhuILwV%2BHRp4R9SlhOCYfeR1PCYHi%2BUK8a1pNtnyx89Fdo%2FG3SQfs4oEJ319P9HLqXTAURaqALv%2FKSFITVJQtd7CF3BvmSuSBq2rOvlce1Ziogwj3f7vi2ThQ7AVyX7SvAKo4M7wwnPZn1aQ%2B6O9A29boI6Oqj4n5b1wVEv2VG1cG2Dvk1DAMm9UiK4y0kVXAeG5s9wnYEqTA2L8hfuBX0Ub8V%2FA5bwWD49lbQrf93AHUg7urTY9DXC1lIWvPkol92XsPsv75LQO2wdrLsVHf4mupM8BTGCf33ZLsjOxpdkGzdfwF9QnE%2BROR47Sh2kFG41U18jFPIDpxUvRXS%2BB9OIlO7kuuVt3GKqADiteS5CdI7Z6yhPGxYA99aM7tfI9HwqrRGjmtSeLduxjnvhgXFw4skuu7odR3v9j8%3D%3C%2Fdiagram%3E%3C%2Fmxfile%3E)

##### evolveBoard
A function that takes a board as input and output a "evolved" board with lists of cells updated.

##### Game

![Game Class Diagram](https://www.draw.io/?lightbox=1&highlight=000000&edit=_blank&layers=1&nav=1&page=1&title=conway-gof-overview#R%3Cmxfile%3E%3Cdiagram%20id%3D%221002ebb3-85d6-c19d-d57d-8200da7cb991%22%20name%3D%22overview%22%3E7Vttb9o6FP41fBxKYifAx8LarVKnTmK69%2B6jm5jgNYmRMW%2F79dcONiTY2WAl6YSM1BIfv8Q%2Bz3lOzrFDD0zy7SeGFvMvNMFZL%2FCSbQ987AWBD4OB%2BJKS3V4yGIR7QcpIohodBVPyEyuhp6QrkuBlrSGnNONkURfGtChwzGsyxBjd1JvNaFa%2F6wKl2BBMY5SZ0n9JwudK6kejY8VnTNK5vnUUBvuaFxS%2FpoyuCnXDXgBm5WdfnSM9mFrpco4SuqmIwH0PTBilfH%2BVbyc4k8rVetv3e2ioPUyc4YKf0yEA%2Bx5rlK2wnnI5Mb7T2iiXg2UHrwfGmznheLpAsazdCPyFbM7zTJR8cXlYkGy75Iy%2B4gnNKCuHAl75OdRo5Yplj2ckyyotH8qPkKcMJUSsRtcVtMCyOS34A8pJJk3saRWTBIlZT2ixpJmuV4blR6p8MoRaOWYcbxvV5x9AEdaOaY4524kmuoPGURl66KkhNhWzCYBS8rxqMtrWkbLV9DD4ES5xoRBrgHvo0LsiesHQM9CD0LOAN%2FTfDl5kYDfJpKoMBMUC%2BQlMNWS0TisQKBHKSFqIYiyGxUI%2Bluoiws%2FdqYqcJEmpcJtd1C2nZhp%2FC36gjh%2B04GeBL7gC9SzMA3cNAB4V6TsKnkAI6xQEQ5sDtWAYXQFDAA2ocCICAVVUq6zToIIU3hL%2BnxT3Q1X6rmp%2BYM53SnloxakQUcbnNKUFyp4oXVh53Ayvf0285BJ%2FjZbQCF2xWLVSMQ9HLMWaQNAOKsMZ4mRdH%2F4tCI2aWTbliGNHtfOpFgzOoBpoi2phS1QTi2e7SpUsflcD3BQN%2FcDCw7AjHuqb14n4CeX4bkEcCc8nIQze8XnnW9ypSxfOxi4cnISblnRBLNrE7irpgjaKCnhTzMSCDAhdvtAE4PD98gU9W9ODOvd5AYIj%2BHv36UctxTBRSzHMTcUp%2BplSi1MGHcUp%2BuYVli0xFzGKdJUkdly7gGuDk90VK9ds7vIaXAugAeQ%2FKwffReleHb4wMB92vj6ouTp8oRms0PgV80cqVeG2yd6YNtjBbIuLgyYwnx2Gf%2B5PrRi25k%2FdSdFbsBuOfp%2F6wait1A9YDxtk7jCmiCWOhOcDOfJPghqvQ0cKzP2XCc1zWhgIuhS%2BCT%2Bv%2FiDsMoWH1hT%2Bcd%2FKUfDsIz8PviMHoZkh9vv9Zz6XG2kRyiU0xctyUa41yiQLE7IWl6m8%2FIi4VNk3horlrLmHmESlk2Wc55cfOObLpva3Zkx%2Be8bkD88wprZOteDAwMqdal20WwRVnl%2FdLQJd7RZBc5Ph8X4tpjteLW%2BPhB0GVV3uFAEzOy0xvM8JFxEQcED%2BOZCdpqhw2L4zhdFBIGs%2FeH0vODjYr5gRMWsZNd%2Bgow1NRwujrhytuR34%2BETT1HJ46dj5i8D5NNbp8uUBaL6v%2BrIqdshMXh2E50No9bBthauh%2BbK%2FUMAGyQnuT6I9OhP%2FnshMXn8Qf89reXCGNwbIboeiMSMJawj7trdE%2FJa2KEJLRCuRdS9LXoii8aKBb9ujCK%2FCU1E8%2FuCnrKv8rArc%2Fw8%3D%3C%2Fdiagram%3E%3Cdiagram%20id%3D%22ba7a88fb-26ae-3efb-303b-872179c9e311%22%20name%3D%22Game%22%3E7Vrbbts4EP0aAe1DA0mUFPvRl7hbIAW8TYHuPtISbXFLiQZF3%2Fr1O5RIWTenduK4i66MABGHQ4rkOTOcIWWhSbL%2FKPA6%2FswjwizXjvYWmlqu67gOgn9KcigkgT8sBCtBI610FDzRH0QLbS3d0IhkNUXJOZN0XReGPE1JKGsyLATf1dWWnNXfusYr0hI8hZi1pd9oJGMtdYLhseIPQlexeXXgu0XNAoffV4JvUv1Cy0XL%2FFdUJ9h0pmeaxTjiu4oIPVhoIjiXxVOynxCmFtesW9FudqK2HLggqTyngRnHFrONnjzZcrYls00aWm7AoJdxtsYpPK%2FUc7sWOq8qdDWy0OgSbdd%2Bd4H6gmMRvdlgPuKEjC98w3tLLesFA4JlD3CyhmejVJTSRbauNLrKcHPWyYOhes5VotjgQPUuppI8rXGoandg3CCLZcJ0dclWWxWk4N%2FJhDMu8q6Qnf%2FKGmM5wOnxkjJW0ZzlPzVdgSMKVDV1KU%2BJUuepnOGEMuU%2FHjchjTCMesLTjDNTr72GE%2BhyowtNayIk2Z%2B0Dae0OHBlhCdEigOo6AaBcUcHY%2F9eUd4dfQIaaJ244g4CLcPaDa3Kro%2BWCA%2FaGE8Ypt8yzC68V0R%2BwWnEkzmWkoj0qnYQ0e1zHfRG%2BkIjPQ8rENcA6A33xYY7RLczXOR0GG4DO5JGIxWmQCmiOOFp9DWmqdpd02hGmUENSnqxXK%2BB55kQOhdiMuzGhOyp%2FEux587Xpb81lwARcSiq7n1TNpXFvEnUCrYaQMLa8I0IST0kkViAd9OL6nUDXgHUMeAJwrCk2%2Fo7uxDV3c05hdEcyYMa5PFQvYtirLpVNbRqdITuGx3ZDXYVE2x1BMzAh4raWilkpwc8sOvvQfZPhuU%2Fow4PxfuPXC%2BX%2Bzz6u78h%2FQ3JnTvbua%2Bx%2FM4eulUDqZrHXWkQcyIorCERrzMM%2F9cahtvgs%2B%2B9zDC8pmEMgzcxDL%2FxHlitZ8fV1HfcK5uG1zYNNFKxS8tCsh1NGC631Cddo%2FiMGV2BrUxDoIoi1FhtlRRy15GukFxt%2FmFMWfSID3yjmJJJyEtNaRxzQX9At%2FhoT1gYI3CDmsaTaqlpK0gGOnPDUqch%2Boz3NcVHnEktCDljeJ3RRTmNBDCm6ZhLyRMTl%2BhJz%2Boxh86f%2F29BjDNoZh9OK4gpA5a4dhjRsMsXRTHt9OMDFP%2Fhiz83REkgPLfVKYCkPLX8seVPWySGucsWUmaNK5BokSE2I0t5ktYQKIc0XT3mOlPvKPmiF0CJOLRdspwqMY0iorYWwSWWuOCfYol2HjBQNfgxrONEOWw1jQmUnWMZ%2FpS6kIoBUmCa40eA3DuiCH4xX84ixynHbnxZcB4Z3OD1XDBnW7UtXZ3SkC3J11Bx4dODKow3WU%2BDG9LAQHMLGqDg55EdozmGHVHYxUAnAFm%2BbhrZrwr46QenhT5qo486kGZ4QdicZzT3WGgqCt0GA%2F6LIN8PzgN5cAWM70%2BYekp2c4YPRLx73xv4DbEf3NDPo8EJ8AVJYKl7%2FH8B%2Fo5zSw8%2F7CTAxLVG9jpHf45lGKtWWc%2BD2%2FIAnbkJXIMHXvtS8JNKUyEXlH2u2ueq7QP3xtGQO%2BzIVZ2uXNW4t1fRtevEfbxZR8DWkSzSk01K95J2nLT0TusVTsuzu2nxTJLaxYKr%2BKzOyLXYtUyKWkQw%2FWnFzYnQlaa%2BFRH89uYFRCjun3MaVC6LewrcjAJdSeyb%2BYIz7qD6k4o3ANmx21%2FIdKJ8haMK%2F3e8Zy8vGq3aJaNvXXJnWLsf9LsBu8H9IDLliy%2FOh169I7txA3%2Bt%2B8FB94BP3lu%2BUt%2FxvAbBL7pPhOLxu9BC%2Ffj1LXr4Fw%3D%3D%3C%2Fdiagram%3E%3Cdiagram%20id%3D%223c369dc2-d054-91be-35a6-1d78f60ecb7c%22%20name%3D%22Gameboard%20Update%22%3E7Vnfb6Q2EP5rVmofigDD%2FnhM9i53D1cpUh7aPnrBAd%2BBzRmT3e1f3zHYYC9wjbJETXUhSmKPB9sz3%2FibWe8K7cvTJ4Gr%2FHeekmIV%2BulphT6swjDYIAT%2FlOTcSXZR0AkyQVOtNAge6N9EC30tbWhKakdRcl5IWrnChDNGEunIsBD86Ko98sJdtcIZGQkeElyMpX%2FQVOZaGqx3w8BnQrPcLL2Ow27kgJNvmeAN0wuuQvTYPt1wic1k2tI6xyk%2FWiL0cYX2gnPZtcrTnhTKucZv3Xt3M6P9xgVh8jkvxN0LT7hoiNlxuy95Ns5Q5lRajQhJTlMQ4INR98dbCHrDIGIIL4kUZ1DRE8U7%2FYoOFmT6x8H1kYmM3Pa6r4VYw531cw8WQ0MbPe2AcOSAr%2FwAgu8NAUHoc0BuXcCKtyl9gmammk2VYklZpuIyV1oZLsmBY5EaZVjW0h%2F5tI0Qorbgw%2FAxp5I8VDhRo0c4UiDLZQlb%2FhBAs48RpVtLwb%2BRPS%2B4aKdCfvv0IyZeweG3j7QoLM279gF5JnBKAR0zxjgjSp0zeYdLWiggvjQJTTHses9ZzQszrs9qsNX9iylmw8QOh3g6HGy4%2FdCLI%2BtnPUZ%2FtwD46N%2BjXwqKWdba%2Fw6TdWo3XuQgFDtnOB6f4K2H%2FLG%2Bjeh2AUSjd0RfiiiKkOfH26D%2FeRuIbkcAkhSSte5q810%2BtSAE28X5Ty1vO3%2BpjhdD9yuR8qz9ihvJQcSFzHnGGS6%2BcF6ZMHgm8sGSUCojZ4HUopo3ItFaG10mYZERaaW2MdyCFJC8ntzZr0FoM5lC0Q3IfvkV%2FrSyNS7V6dLp0P8ECfO2S5izqTH4%2BU7ojyslFLqVUuSPTyVYPT6H6wXOYTBOlp7njdmVnOQFRg4sxqGW%2F7UIFzRj0E3AGwTkt8pXFIryGz1Q0jSdpW2XAZy4eBvg9SAY8IKJMncCu3CJIje6jkRPVPYcCu23Q6HRkhTaZbwrCFO%2Fes8prDIAv7k8tReIdpyt3xpAvRECny21SinU8%2BtEkbuOCbi7Z%2Boj9GP98Ep9Y%2FcQs52FQwT3Pn8eIW1HhEQVc0D%2FtwOuIZAhBJ540UjK2Sj%2BgSEq1ezoyk06VuhPUU2K67zXVZ17LGFd1kpCP%2Frp8lK8dav%2FnrPsvDT1CX6J%2BtB8iHsht%2F3XDLZoEXh1yTdzkuOLkxy9DoOF%2FvQ6SzHGxGWPua%2BpK8zMbU1V4DMRdetumeTqkgvmUX3Aifd3Ppf3PfYU73TzinSzdaMkjifYZqoKXoRt1v9rtpmpl%2FoCzwtNvadqvMDzUaj790RQ8JYqzFujXkhQM1cQ1xJUsPN21rPZuDxyWUMvxFcBiifXWYyvxrfzArOUlxYltRTV1jpT5OQfc8KURfDLyFHpt%2BSmoFO1Uv1OVK9IVBef%2BIIJokLrCaJ6yRcb0B2%2BNepibfhuDn38Bw%3D%3D%3C%2Fdiagram%3E%3Cdiagram%20id%3D%2275b3910a-fef7-363b-02b9-9b51502e72cc%22%20name%3D%22client%20server%20events%22%3E7VpLk9soEP41rt09bEoSkmwfPc5M9pCtmqrZqk2OjMTIbLBQITy28%2BsXEHog5EdsyU5V5ItFAy2gv%2F4aGk3Acr37xGC2%2BpvGiEw8J95NwMeJ57m%2BNxV%2FUrIvJNNpUAgShmPdqBa84O9ICx0t3eAY5UZDTinhODOFEU1TFHFDBhmjW7PZGyXmWzOYIEvwEkFiS%2F%2FFMV9pqRvO64q%2FEE5W5avDwCtqXmH0LWF0k%2BoXTjzwpn5F9RqWyvRM8xWM6bYhAo8TsGSU8uJpvVsiIhe3XLei39OB2mrgDKX8nA6g6PAOyUbPfQIWn%2BAaLTKsR8j35bKIwWbykak1f1jxNRElVzxuV5ijlwxGsnorQCFkkOAkFcVIDAUxIajm6sgCZ%2FQbWlJCmVIOHPWrasp1F%2BN5eMOENFo%2BqZ%2BQJwzGWGgv61KaItmcpvwJrjGR6Pu8iXAMxTyWNM0pKes15tyZLrdU6FVBjKPdwZV1K3sJR0B0jTjbiya6AxC6VRftA66nfWDbQFSoYbBqgKmUQQ3ipFJd21E8aFMeMKtjGQ%2FFAuK6qGepcIpibZGGOdEO8y%2BN56%2ByyYdAllIxki%2B6hyrUdf8hzvd6YeGGUyGijK9oQlNIPlOaaY3nmt79QVuGx2wpp3%2FckmK16IZFulWoaQeyBOlWBavZBmeIQI7fTfXXWC%2B0nDJHXDjkC2LvWAxw9Msr%2FHIe3tEvy8DYMK0k29Gi11jU9Zw7mnRuWRS9q4Ev6g0KpqmkoJzDV4LzlaDcQwZHO24Qs3va%2BjFUGosGsvAMuYBBqiSe4%2F%2BkePAHw0Mwc004BDYcvFlgwwH0AAfXuy7yVvH1gxtOzRgrYa0Fz4hhMTTp7ErDvUPvUWOeDr1XxFTd9ZliobGCgD8FBgS8EgKliiLU617N%2FXFL0bzseEhRsUGwFCmYVPM5Dzn2Xjwi0snkijEqXNGOEyZRdLFDA1u%2FFguEbmhazukICl0s4PcR551jUSFRIV%2FYEXL5v8li9TCGhOHA4Jh84HeFBH%2BgkFAdLy4LCSO3tyjZN3d7waXc7k9PKOqP2zvyLNGGsYLcTToYGf5spwamUwc3ZfjAsqjt5Wm8kNnIetYGMTcNd1vfbewyqy3lV63%2BXL82cyOg21INSwQd569SdiUjgLnpyNP2ue5sRmjl7KqQMAAj2EmeXws%2F9wKL65TuX6KlTQfnokVoauUdZoPBBbg2XMBiqc8HY%2FbomuzRPfP0HfcvR1ggIjDPcaQWHzJui29ACQey7JddGZwfbJq5efCzBSBv3ko3tOPGuZQCfFOROx%2BOUXwLelE3nfDiBHoQW6U7N7xfiyxqkZ6KI0gWumKN41ghrIuYzBORwUq9XQtdl2h0zUhSMkIDdH4H6Lw%2BiMPefsrbIbHIo%2FXOvQhq5QRuaT37GqhOD4VwLdcvfc0zNdGQSPvlGUzFcyKfI7Ee0qq6SrytWXtwOzAmkvpPJIkJWqgZLJEEZvbmYEwk9ZZI8p3pZVG7nUiyFPUYte3rxjqRlBG4R%2By3fKIuHguKGNNJl6aTQDC1XHuwdJJ%2F7MLgdEQoLC%2FIOVoVisfIcPtbZ%2FO%2BKXQ7IsNQt87%2BdVcM461zT7fOrTyke2FmaR46xxX1F1B8zyKerPDk3zOaY%2FnpSv7HGEZ%2BIIyUXUoe6DhXDBdG7HyS%2BpDXeZTBJLfsaB8OGcrxd%2FiqGkirZBJjakTBwyT4KI%2BFwtNzvYyNUyJBb7zjjMglC8hYFeE0%2BUdRwp%2F%2BpPuMd8p4A5wBTYcFHaZy%2BzkDimL9VXfhp%2FW38%2BDxfw%3D%3D%3C%2Fdiagram%3E%3C%2Fmxfile%3E)

The __Game__ class at server side broadcast its state to clients via api service whenerver updated. Ideally, the game board can be updated by evolution or manually updated by players at any time. But it would be complex and hard to debug if the game board is being updated by evolution and by user at the same moement. Thus, the __Game__ internally uses a queue to avoid muting the game state concurrently. Any update logic to the board will be packed in a funtion and queued up, and the board will be updated sequentially according to queue order. The __Game__ keeps scanning and consuming the job queue every 10 milleseconds, making it feeling reactive in players' experience. The following diagram shows different events which will enqueue an update function.

![events updating the game board](https://www.draw.io/?lightbox=1&highlight=000000&edit=_blank&layers=1&nav=1&page=2&title=conway-gof-overview#R%3Cmxfile%3E%3Cdiagram%20id%3D%221002ebb3-85d6-c19d-d57d-8200da7cb991%22%20name%3D%22overview%22%3E7Vttb6M4EP41%2BbgRYEPSj0223avUU0%2FK6nb3owsO8RZwZExe9tefDSaB2OymbaCnyJFawfgFzzzzDDN2MgLzdPeFofXqbxrhZOQ50W4EPo88L5h64r8U7CuBB%2F1KEDMSVSL3KFiQX1gJHSUtSITzVkdOacLJui0MaZbhkLdkiDG6bXdb0qT91DWKsSZYhCjRpd9IxFdK6gY3x4a%2FMIlX9aMDX2n8jMKXmNEiUw8ceWBZfqrmFNWTKU3zFYrotiECdyMwZ5Ty6irdzXEibVvbrRp339F6WDjDGT9ngAeqERuUFLhecrkwvq%2BtUaqD5QBnBGbbFeF4sUahbN0K%2BIVsxdNE3Lni8qCQ7JtzRl%2FwnCaUlVMBp%2FwcWmrjCrVnS5IkjZ735UfIY4YiIrSp2zKaYdmdZvwepSSRLvZYhCRCYtVzmuU0qduVY7mBuj%2BZQmmOGce7TvO5B1CEs2OaYs72oks9oMZRObrvqCm2DbfxgDLyqukyta8j5avxYfIjXOJCIdYB99Sid0H0vKmjoQehYwBv6r4fvEDDbp5IU2kICgX5CUwtZGqbNiBQIpSQOBO3oZgWC%2FlMmouIOHerGlISRaXBTX7R9pyWa%2Fxf8ANt%2FKABPwN83gWoZ2AeuO0A8GhI11LwBELYpiCYmgKoAcPgAhgCqEGFI5EIqFulZZsGDaTwjvDvUjz21d0P1fITc75XxkMFp0JEGV%2FRmGYoeaR0beRxN7zuJfGSKv4eLWERWrBQ9VI5D0csxjWBoBlUhhPEyaY9%2FXsQuulm2YIjji3VzqeaNzmDaqAvqvk9UU0oz%2FaNJnn7Q01wVTR0PQMP%2FYF4WD%2B8TcQvKMW3a2JJeD4JofeB7zvXEE5tuXA2dv7kJN00lAtCaR27i5QLtVM0wFtgJhTSILT1QheA04%2BrF%2BrV6hHUhs%2B3IzhsuRD0lMNcVZ5Sv1NaecpkoDylfniDZTnmIkeRoZKElmuv4NrEO4NrpnB5Ca55UAPy38LC96pyrw2f7%2BkvO7ciZg%2Fw%2BXqyQsMXzB%2BoNIXdJntn2WAGsy8uTrrAfLIYvj2eGjHsLZ7ak6L3YDe9%2BXPpB4O%2BSj9gPGyQtcOMIhZZEp4P5I17ktQ4AwZSoO%2B%2FzGma0kxD0JbwXfg57RfhkCU8NJbwD1UvS8Gzj%2Fwc%2BIEchHqFOB6Pn%2FhKbqQFKJXQZM%2F5utQ1SCQLI7IRl7G8%2FIy4NNlXhrJ82T1CLKIxyDDP0%2FNPHPK8q%2F%2B1OZPbnzO5pztCJmfq61QLTjSs7KnWq3aLoKrzm7tFYKjdIqhvMjzcbcRyZ0V%2BfSQcMKkacqcI6NVpieFdSrjIgIAF8u1ADlqiwmn%2FwRQGB4Fs%2FeSMHe8QYP%2FBjIhVy6z5CgOtrwdaGAwVaPXtwIdHGseGw0vLzt8kzh95%2BgX176s%2BF9ke6cWrhfB8CI0Rtq901de%2F7C8MsEVygdVJtEOX4t8jWcrrT%2BLvaSMPzvBWA9nuUHRWJH4LYdf0LRH3MlsU4vb4U5GyrfF7HHD3Hw%3D%3D%3C%2Fdiagram%3E%3Cdiagram%20id%3D%22ba7a88fb-26ae-3efb-303b-872179c9e311%22%20name%3D%22Game%22%3E7Vnbjts2EP0aAelDF7rbflx74%2FRhAxhxgCaPtEhLRCjSoOhbvr5DiZR181ZOvduiWL2seDgcknPOyEOuEyzy0yeJdtlngQlzfBefnODJ8X3Pm4XwRyPnCgn9WQWkkmJjdAHW9CcxoGvQPcWkaBkqIZiiuzaYCM5JoloYklIc22Zbwdqz7lBKesA6QayP%2Fkmxyuy%2B4tml4w9C08xOHUd%2B1bNByY9Uij03Ezp%2BsC2fqjtH1pnZaZEhLI4NKPjoBAsphKre8tOCMB1cG7dq3PJKb71wSbgaNcAwdUBsbzbvBI%2BfUE7M%2BtTZBqU40pwhDq35VnC1Nj0etBGjKYf3BGYlEoADkYpCPB9NhxI7QJOMMvyMzmKv11YoiJVtzTMh6U9wi5jxCd1SGWkEXstirUcC7AIqSQE2K7thrwN9RqeW4TMqlAESwRjaFXRTbyNHMqV8LpQSuTGym15SxhaCCVnGwnIK%2FZa%2F0lhJ8YM0zNzyqXuslnwdwrbDZfkAnkqEKSzc9nFRR3yJcsp0Rj3vE4oRsLMQvBCsZqQKljc17Y4LQzQwQ05X1eLVGoTkJiInSp7BxAyoZWvy2rMujpcs8SNjkzUTJIxMdprMTGvfF3HCi9HnFa3Gfa12Rcpoudd2vL1OvE1ArGoZ2aoBzeYU4zK2xQ4llKdftYaffvcuyHM58Cm4IF%2FMljUkhUIKVerSGmBoQ9hKFFRRof3Lyna%2BE5SrMizR3ImeSkQqTa2SiJbEEFDtkWjljmQxHKbR0BaMZG16B84mA5zBJlxOjiuGzkR%2B%2BK1HImxN9dLJJsLNPFbfnjZlYZ8yDQkYu2VlPmfAPuEDNLbpmkPYFu5DpInzF9D2Lu2%2F5bKZtLMRSX4X7mfjuPfjO5A%2FvUK%2BJDmE%2Bp3%2Ff4H%2FOHpD%2FmeD%2FC9859HdleSvkEoyPap4l8GbymA28icgCv%2B5DGzR0JABOQh2IMs9Txw%2FZqqigcN7qt%2F7vTBF02BoEJStt1j77ocbzDcCSfxqi9Hl9vzGGSBd3JsWBGGPUa5zwBpVLb4pdo1Bd1luJ5HL8xDBphI7ZlSRNWSd7j3CAVLX9iqv6%2F7%2FYEUdv1pFHXuditoeyBqJGUwHEjN275CY0cD3uc93StQXxLHI4WsNxzt%2B1zzA9PCSg%2Fck%2FcUkHccVwC0C3hP3lxN3Frxd4toD3EsnYcLxo74KgxamKBccf82ormSgQ99mGNagZYLlhx0%2BR1Lo3cjJbJgTiLs8f9MGD67nWeC71tOD5%2FkWWBFJIV76lqkUGjlR9a3xXg2IapIJ7l31dSiGqIm9TEi7WFFIwnfv5VqqQbVnaZWEIUUP7TmHuDbuVrqObMgq6MgqDNouqrWaUc2Lva6jjj6nHdlV%2B%2Bv5KZVXb3GcGP3%2FsxjbQoxeQ3HRgOImb6e47p1et%2BQfq7hwEnQcBaMkB8JA54aZOVldXXA0aS8YFPjiurr23iTsKL5awUj9Q%2FNyPV%2BZX%2F4JEnz8Cw%3D%3D%3C%2Fdiagram%3E%3Cdiagram%20id%3D%223c369dc2-d054-91be-35a6-1d78f60ecb7c%22%20name%3D%22Gameboard%20Update%22%3E7VlRc6M2EP41nmkfygACbD8mvsvdw3UmM3lo%2ByiDAroDiRNybPfXdwUSSAaumZhM07mQSSKtFkm73%2BrbtbxCu%2Br0SeC6%2BJ1npFyFfnZaoQ%2BrMAzWfgL%2FlOTcSZIAdYJc0EwrDYIH%2BjfRQl9LDzQjjaMoOS8lrV1hyhkjqXRkWAh%2BdNUeeemuWuOcjAQPKS7H0j9oJgstDZLtMPCZ0LwwSydx2I3scfotF%2FzA9IKrED22TzdcYTOZtrQpcMaPlgh9XKGd4Fx2req0I6VyrvFb997dzGi%2FcUGYfM4LcffCEy4PxOy43Zc8G2coc2qtRoQkpykI8N6o%2B%2BMtBL1hEDGEV0SKM6joieKtfkUHCzL94%2BD6yERGYXvd10Ks4c77uQeLoaGNnnZAOHLAV74HwfcDAUHoc0AuKWHF24w%2BQTNXzUOdYUlZruKyUFo5rsieY5EZZVjW0h%2F5tI0Qorbgw%2FCxoJI81DhVo0c4UiArZAVb%2FhBAs48RpdtIwb%2BRHS%2B5aKdCfvv0IyZeweG3j7QsLc279gF5LnBGAR0zxjgjSp0zeYcrWiogvhxSmmHY9Y6zhpdmXJ%2FVYKP7F1PMhokdDvF0ONhw%2B6EXR9ZPMkZ%2FuwD46N%2BjXwqKWd7a%2Fw6TdWrXXuQgFDtnOB6f4I2H%2FLG%2BjehmAUSjd0RfiiiKkOfHm6D%2FeRuIbkYAkgySte5q810%2BtSAE28X5Ty1vO3%2BpjhdD9yuR8qz9ig%2BSg4gLWfCcM1x%2B4bw2YfBM5IMloVRGzgKpRQ0%2FiFRrrXWZhEVOpJXaxnALUkLyenJnvwah9WQKRTcg%2B%2BVX%2BNPKElyp06XTof8JEuZtlzBnU2Pw853QH1dKKHQrpcgfn0qwenwOkwXOYTBOlp7njdmVnOQFRg4sxqGW%2F7UIlzRn0E3BGwTkt8pXFIryGz1Q0SybpW2XAZy4eBvg9SAY8IKJMncCu3CJIje6jkRPVPYcCu23Q6HRkhTaZbwrCFO%2Fes8prDIAv748tReIdpyt3xpAvRECny21Wik08%2BtEkbuOCbi7Z%2Boj9GP98Ep9Y%2FcQs52FQwT3Pn8eIW1GhEQVc0D%2Ftz1uIJAhBJ54eZCUs1H8A0PUqtnRlZt0rNCfopoMN0Wvqzr3WMK6rJWEfvTT5aV441b%2FPWfZeWnqE%2FwS9aH5EPdCbvuvGWzRIvDqkm%2FmJMcXJzl6HQYL%2Fel1lmKMicsec1%2FT1JiZ25q6xGcimtbdMi3UJRfMo%2FqAE%2B%2FvfC7ve%2Bwp3unmFelm40ZJHE%2BwzVQVvAjbJP9rtpmpl%2FoCzwtNvadqvMDzUaj790RQ8JYqzFujXkhQM1cQ1xJUsPW21rNeuzxyWUMvxFcBiifXWYyvxrfzArOMVxYltRTV1jpT5OQfC8KURfDLyFHpt%2BSmoFO1UvNOVK9IVBef%2BIIJokLJBFG95IsN6A7fGnWxNnw3hz7%2BAw%3D%3D%3C%2Fdiagram%3E%3Cdiagram%20id%3D%2275b3910a-fef7-363b-02b9-9b51502e72cc%22%20name%3D%22Page-4%22%3E7VnBctsgEP0aXzsCJEs%2Bpm6SHtKZzOTQ5kgkItFgocEotvv1BQksIZTGiZWkM7EuEQ9Ysby3uwTP0HK1vRS4Kn7wjLAZDLLtDH2bQQjAIlR%2FNLJrkRAuWiAXNDODOuCG%2FiEGDAxa04ysnYGScyZp5YIpL0uSSgfDQvCNO%2ByeM%2FerFc6JB9ykmPnoT5rJwvo1X3Qd3wnNC%2FvpeQTbnjucPuSC16X54Ayi%2B%2BZpu1fYGjOerguc8U0PQucztBScy%2FZttV0SpjfX7ls77%2BKJ3v3CBSnlIRNQO%2BERs9r4PkNnS0b19HaBcmd3Ra210q%2Bi2fKvhVwx1QLqdVNQSW4qnOrujdKEwjCjeamaqTJFhAL2rga6IQV%2FIEvOuGiMo6B59j1229Vyvt5TxnojL5pH4bnAmV6o7St5SfRwXsoLvKJMi%2B%2BqTmmGlR9LXq45s%2F1GciAx7YEJsylESLJ9cmPBni4VB4SviBQ7NcRMWBiCbQSY5qYnp7nBip6SLIaNgvO94Y5E9WJ4HOd07nF6iVfkROcxdMbhx%2FG58Pgkj82yz7oUSHmpGmQt8R2j64JkT9JNtprtJkWRzBD%2BDPcZbiy2A3TjGkslgrJBYBD%2Bp2oI30wNKEKOGmJfDTCJfDWgCdQAoEctyVT1Mk3jZMdv4PKrPBS7Xxr%2FAuaxBW5bAEYWuCaCqqXpSG8s%2FCZS7szG4lpyBXEhC57zErMrzitj%2FlDqwZRcav9fyqQgDEv66M4b48VMveZUl0SrABhGjgJAPKB2zWuREjOrX4AHhmIY%2F9uQxCIn0jPUyGTvz2HK8Yt9aip9UAmuItEvEm6eGEsOPW19siSQJC5zcKQmjGWBcIosMD8qC5zCeRiFbnn3ODo0nGH0jKEJwzn2wrlieKdSdnMqkLrQn8L58HAGLnNg8Z7hnPipuRaizc15c3pXNGJ5StAvYDT6SEZtQhk%2FtbuUBnWVjXF7OrJPGN7xIDEnI2f28I3O7Ha5p2o9TbUG7uEbJa%2Bt1uEzhqar1iM3bacMf2xQh4Eb1Ai9Z4aPPEb9KC%2BzM30f3XntJOY%2Bce8bu71rgP3%2F%2FLfG%2FKFxDYM2PMzejzPVYyIauR%2Bz2JEZAQyyexi9MiOAwb0tGF7gTZgR%2FHvaz6WfjxJLAicSy9AQCKYSi2p2vwG1w7tf2tD5Xw%3D%3D%3C%2Fdiagram%3E%3C%2Fmxfile%3E)

To enable easier testing and debug, the following items were intentionally designed as injected dependencies of the constructor of __:Game__ .(below only list some arguments important to note, for full list of argumrents required plz See __./solution/ts_code/server/game-engine/game.ts -> constructor()__)

  - `evolveFunc: (board: GameBoard) => GameBoard`: the logic of natural evolution
  - `getRandomPattern: (board: GameBoard) => Pattern`: random pattern generator,it can be mocked with a function which returns known pattern series during testing
  - `eventBus: IEventBus`: mainly used to broadcast game state updates
  - `evolveTimer: IIntervalLoopSetter`: an interface that does similar function as native JS `setInterval`, by mocking this object, you can manually control how and when the board updates during testing
  - `jobQueueTimer: IIntervalLoopSetter`: an interfae that does similar function as native JS `setInterval`, by mocking this object, you can decide the behaviour of how and when a update-board job is dequeued and consumed during testing

By using these injection you can simulate a completely predicatable test against the state changes of the game board. See `./solution/ts_code/server/tests/set-api-service.spec.ts`

#### Events

Different components depend on `IEventBus` to coordinates with each other. Theses files defined the event keys:

 - `apiEvents`: ./solution/ts_code/common/src/api/api-events
 - `socketEvents`: ./solution/ts_code/common/src/api/socket-events

The major events happened between server and clients is shown below (error events omitted):


#### Logging
This project used [bunyan](https://github.com/trentm/node-bunyan) for logging implementation of the `ILogger` interface. 

 - In development environment it will output everything to the `stdout`. 

 - During tests it will output logs to `./solution/dist/server/tests/ouput_xxxxx.txt` depending on the datetime at runtime.

The whole application starts with one root level logger, and different places in the application may spawn a child logger by using `logger.child(customKey: stirng)`, and all the json output by the child logger will have the property __customKey__ you can track with.


All the event buses, as well as socket-io in the application should be already attached with a logger by `./solution/common/src/log-event-bus.ts`. Every time when an event, e.g. `apiEvents.gameStateUpdate` is registerd with a handler or emmited, the event will be automatically logged as well as the arguments passed through. You can easily track the application on your heroku deployment by redirecting `heroku logs` to you own disk. You can also use some json search and filter techniques provided by [bunyan cli](https://github.com/trentm/node-bunyan#cli-usage)

For example, a root level log is like this

```javascript
{"name":"Development Log","hostname":"6a6b14989f8f","pid":464,"level":30,"msg":"listening on 8080 undefined","time":"2017-12-26T07:41:16.694Z","v":0}
```

And a child logger by spawned by `logger.child('apiService - socketio')`  looks like this, as you can see it has a property named `apiService - socketio`. This is a sample log when a handler is registered(mounted) on the __error__ event.

```javascript
{"name":"Development Log","hostname":"6a6b14989f8f","pid":464,"apiService - socketio":"apiService - socketio","level":30,"eventKey":"error","msg":"event mounted on 1514274076702","time":"2017-12-26T07:41:16.702Z","v":0}
```

And here is another sample log when the event __game-state-update__ is emitted.

```javascript
{"name":"Development Log","hostname":"6a6b14989f8f","pid":464,"level":30,"eventKey":"game-state-update","args":[{"updateAt":1514274121728,"players":[{"uid":"S1h76OkXf","name":"Plaki","color":"#a5c359"}]}],"msg":"event emitted 1514274121728","time":"2017-12-26T07:42:01.728Z","v":0}
```

## Versioning

  [SemVer](http://semver.org/) is used for versioning. 

## TODOs

  - __common/src/api/__`apiEvents` contains keys representing client->server and server->client, better to sepearate them in later versions.
  - __dist/client/static__: Move it somewhere else and copy it into `dist` at build time, so that `dist` can be a directory purely for built artifacts.
  - at client side, `Client` is calling `GameApi` and vice versa, they depended on each other, but things can be simpler, `Client` does not need to know anything about `GameApi`, but just has to simply expose its methods to `GameApi`, then `GameApi` will call `Client` according to different events. By doing so `Client` does not depend on `GameApi` anymore. Bi-directional dependency becomes one way. That's actually what I already did at server side, `Game` does not know anything about the api object, in fact there is not even a real class named `ApiService`, just used the function `setApiService` to set tup the `Game`'s behaviour according to different events.
  - currently the board is bordered and cannot have negative coordinates. But the `evolveBoard()` function CAN support borderless evolution argrithmatically. What else needed is to implement a board which can dynamically shrink and enlarge its width and height according to the cells it has, of course then the client intereface should also support world-exploring feature.
  - better error messages to players
  - a log reader to organize and present the logs nicely
  - For production environment, use `pm2` to restart process in case of exit, and add health monitor like [appmetrics](https://github.com/RuntimeTools/appmetrics)


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
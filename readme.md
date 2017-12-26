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
- You shall be at the /home/dev now. The `package.json` at root directory is __NOT__ the package.json for this project. This is just a file created for Heroku's requirement to deploy the app successfully. Instead, you should go to `solution` folder to see the real package.json, where the project source code stays, like below.

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

![conway gof overview](https://www.draw.io/?lightbox=1&target=blank&highlight=000000&edit=_blank&layers=1&nav=1&title=conway-gof-overview#R7Vttc9o4EP41fCxjW7aBj4EmuczkJjdD59p%2BVGxh1NgWI8u89NefZEtgIzmlCYZLR8wkWLuykPbZZ70rwQDMsu09havl3yRG6cBz4u0AfB54njsKff4mJLtaMvHCWpBQHMtOB8Ec%2F0RS6EhpiWNUtDoyQlKGV21hRPIcRawlg5SSTbvbgqTtT13BBGmCeQRTXfoVx2wppW44OSj%2BQjhZqo8OA6%2FWPMPoJaGkzOUHDjywqF61OoNqMLnSYgljsmmIwO0AzCghrL7KtjOUCuMqu9X33XVo9xOnKGen3OCB%2Bo41TEukplxNjO2UNarlIHGDMwDTzRIzNF%2FBSGg3HH8uW7Is5S2XX%2B4XJPoWjJIXNCMpodVQwKlee40yLl%2F2dIHTtNHzrnpxeUJhjPlqlC4nORLdSc7uYIZT4WKPZYRjyGc9I3lBUqWXjuWGsn00hG4rab41ogxtGyJpu3tEMsTojndRWoWjdPTAkUNsGm7jAWnkZdNllK9D6avJfvADXPxCItYB99iid0b0vLGjoef7jgG8sft%2B8EINu1kqTKUhyFfDjmBqIaNs2oBAimCKk5w3Iz4s4vKpsA3mce5GKjIcx5XBTX7R9pyWa%2Fxf8ANt%2FHwDfgb4vDNQz8A8cNMB4MGQrqXgEYR%2Bm4JgbAqgBgzDM2AIfA0qFPNEQDblKts0aCCFtph9E%2BJhIFvfpeYHYmwnjQdLRriIULYkCclh%2BkjIysjjbnjdnvEqSEkjaQGZ4jBIE6T4Iu0kjPMqqBSlkOF1O4t6D0KTbpbNGWTIUu10qnmjE6gG%2BqJa0BPVuD3orqESze9ygI9MQ9cz8DC4Fg%2FVbNpEvIcZullhS8LTSeh7V3zeuYZwasuFk7ELRkfppqFc4IvWsTtLuaCcogHeHFE%2Bew1CWy90ATi%2BXr2wn60WQW34fDuCly0Xwp5ymI%2Bcp6hHSCtPGV0rT1GzabCsQIznKCJU4shy7Te4NvJO4JopXJ6Da6rkbAD5b2nh%2B61yrw1f4OkPO1cx9ezwBXqyQqIXxB6IMIXdJntn2WAGsy8ujrrAfLIYvj2eGjHsLZ7ak6L3YDee%2FLr088O%2BSj9gPGwQtcOUQBpbEp4O5MQ9SmqcCwZSoO%2B%2FzEiWkVxD0JbwXfg57QfhJUt431jCP9S9LAVPPvJz%2FCty0NcrxOFw%2BMSWYiMthJmAJn8uVtVaw1SwMMZrfpmIy8%2BQCZN9oTAvFt138Ek0bjKM8%2FT8A0Ws6Or%2FpzmT258zucc7QiZn6utUyx9pWNlTrdd2i3xZ1jd3i8DVdot8fZPh4XbN5z8tiz%2BPhBdMqi65UwT06rTC8DbDjGdAwAL5diAvWqL64%2F6DqR%2FuBUL7yRk63j7A%2FoMo5rMWWfPHD7SBHmj98GqBVt8OfHgkSWI4vLTsfCVxvubpl69%2FX%2FW5zHdQL14thKdDaIywfaWrgf5lf26ADRQTrE%2BiHbLg%2Fx7xQlx%2F4n9Pa3FwhjYayHaHorMiCVoIu6Zvibjn2aLgzcNPRSpd4wc54PY%2F)

As in the diagram, 
  - `common` includes data models, interfaces, events, and utitlities, e.g. logger that are shared by both front&back ends.
  - `client` contains front end logic. __Vue__ is used as the reactive presenter of __:ClientState__, which is part of __:Client__, __:GameApi__ takes care of communication with server, and coordinates with __:Client__ through events.
  - `server` 's main component is the __:Game__ instance, the function __setApiService__ handles communication with clients and manipulate the __:Game__ instance accordingly

The real time connection is currently implemented with __SocketIO__, but can also be replaced with other solutions if needed in the future, by changing the __GameApi__ at the clien-side and __setApiService__ at the server-side.

#### The Game

The __Game__ class at server side broadcast its state to clients via api service whenerver updated. Ideally, the game board can be updated by evolution or manually updated by players at any time. But it would be complex and hard to debug if the game board is being updated by evolution and by user at the same moement. the __Game__ internally uses a queue to update the game board to avoid muting the game state concurrently. Any update logic to the board will be packed in a funtion and queued up, and the board will be updated sequentially according to queue order. The __Game__ keeps scanning and consuming the job queue every 10 milleseconds, making it feeling reactive in players' experience. The following diagram shows different events which will enqueue an update function.

![events updating the game board](https://www.draw.io/?lightbox=1&highlight=000000&edit=_blank&layers=1&nav=1&page=2&title=conway-gof-overview#R%3Cmxfile%3E%3Cdiagram%20id%3D%221002ebb3-85d6-c19d-d57d-8200da7cb991%22%20name%3D%22overview%22%3E7Vttb6M4EP41%2BbgRYEPSj0223avUU0%2FK6nb3owsO8RZwZExe9tefDSaB2OymbaCnyJFawfgFzzzzDDN2MgLzdPeFofXqbxrhZOQ50W4EPo88L5h64r8U7CuBB%2F1KEDMSVSL3KFiQX1gJHSUtSITzVkdOacLJui0MaZbhkLdkiDG6bXdb0qT91DWKsSZYhCjRpd9IxFdK6gY3x4a%2FMIlX9aMDX2n8jMKXmNEiUw8ceWBZfqrmFNWTKU3zFYrotiECdyMwZ5Ty6irdzXEibVvbrRp339F6WDjDGT9ngAeqERuUFLhecrkwvq%2BtUaqD5QBnBGbbFeF4sUahbN0K%2BIVsxdNE3Lni8qCQ7JtzRl%2FwnCaUlVMBp%2FwcWmrjCrVnS5IkjZ735UfIY4YiIrSp2zKaYdmdZvwepSSRLvZYhCRCYtVzmuU0qduVY7mBuj%2BZQmmOGce7TvO5B1CEs2OaYs72oks9oMZRObrvqCm2DbfxgDLyqukyta8j5avxYfIjXOJCIdYB99Sid0H0vKmjoQehYwBv6r4fvEDDbp5IU2kICgX5CUwtZGqbNiBQIpSQOBO3oZgWC%2FlMmouIOHerGlISRaXBTX7R9pyWa%2Fxf8ANt%2FKABPwN83gWoZ2AeuO0A8GhI11LwBELYpiCYmgKoAcPgAhgCqEGFI5EIqFulZZsGDaTwjvDvUjz21d0P1fITc75XxkMFp0JEGV%2FRmGYoeaR0beRxN7zuJfGSKv4eLWERWrBQ9VI5D0csxjWBoBlUhhPEyaY9%2FXsQuulm2YIjji3VzqeaNzmDaqAvqvk9UU0oz%2FaNJnn7Q01wVTR0PQMP%2FYF4WD%2B8TcQvKMW3a2JJeD4JofeB7zvXEE5tuXA2dv7kJN00lAtCaR27i5QLtVM0wFtgJhTSILT1QheA04%2BrF%2BrV6hHUhs%2B3IzhsuRD0lMNcVZ5Sv1NaecpkoDylfniDZTnmIkeRoZKElmuv4NrEO4NrpnB5Ca55UAPy38LC96pyrw2f7%2BkvO7ciZg%2Fw%2BXqyQsMXzB%2BoNIXdJntn2WAGsy8uTrrAfLIYvj2eGjHsLZ7ak6L3YDe9%2BXPpB4O%2BSj9gPGyQtcOMIhZZEp4P5I17ktQ4AwZSoO%2B%2FzGma0kxD0JbwXfg57RfhkCU8NJbwD1UvS8Gzj%2Fwc%2BIEchHqFOB6Pn%2FhKbqQFKJXQZM%2F5utQ1SCQLI7IRl7G8%2FIy4NNlXhrJ82T1CLKIxyDDP0%2FNPHPK8q%2F%2B1OZPbnzO5pztCJmfq61QLTjSs7KnWq3aLoKrzm7tFYKjdIqhvMjzcbcRyZ0V%2BfSQcMKkacqcI6NVpieFdSrjIgIAF8u1ADlqiwmn%2FwRQGB4Fs%2FeSMHe8QYP%2FBjIhVy6z5CgOtrwdaGAwVaPXtwIdHGseGw0vLzt8kzh95%2BgX176s%2BF9ke6cWrhfB8CI0Rtq901de%2F7C8MsEVygdVJtEOX4t8jWcrrT%2BLvaSMPzvBWA9nuUHRWJH4LYdf0LRH3MlsU4vb4U5GyrfF7HHD3Hw%3D%3D%3C%2Fdiagram%3E%3Cdiagram%20id%3D%22ba7a88fb-26ae-3efb-303b-872179c9e311%22%20name%3D%22Game%22%3E7Vnbjts2EP0aAelDF7rbflx74%2FRhAxhxgCaPtEhLRCjSoOhbvr5DiZR181ZOvduiWL2seDgcknPOyEOuEyzy0yeJdtlngQlzfBefnODJ8X3Pm4XwRyPnCgn9WQWkkmJjdAHW9CcxoGvQPcWkaBkqIZiiuzaYCM5JoloYklIc22Zbwdqz7lBKesA6QayP%2Fkmxyuy%2B4tml4w9C08xOHUd%2B1bNByY9Uij03Ezp%2BsC2fqjtH1pnZaZEhLI4NKPjoBAsphKre8tOCMB1cG7dq3PJKb71wSbgaNcAwdUBsbzbvBI%2BfUE7M%2BtTZBqU40pwhDq35VnC1Nj0etBGjKYf3BGYlEoADkYpCPB9NhxI7QJOMMvyMzmKv11YoiJVtzTMh6U9wi5jxCd1SGWkEXstirUcC7AIqSQE2K7thrwN9RqeW4TMqlAESwRjaFXRTbyNHMqV8LpQSuTGym15SxhaCCVnGwnIK%2FZa%2F0lhJ8YM0zNzyqXuslnwdwrbDZfkAnkqEKSzc9nFRR3yJcsp0Rj3vE4oRsLMQvBCsZqQKljc17Y4LQzQwQ05X1eLVGoTkJiInSp7BxAyoZWvy2rMujpcs8SNjkzUTJIxMdprMTGvfF3HCi9HnFa3Gfa12Rcpoudd2vL1OvE1ArGoZ2aoBzeYU4zK2xQ4llKdftYaffvcuyHM58Cm4IF%2FMljUkhUIKVerSGmBoQ9hKFFRRof3Lyna%2BE5SrMizR3ImeSkQqTa2SiJbEEFDtkWjljmQxHKbR0BaMZG16B84mA5zBJlxOjiuGzkR%2B%2BK1HImxN9dLJJsLNPFbfnjZlYZ8yDQkYu2VlPmfAPuEDNLbpmkPYFu5DpInzF9D2Lu2%2F5bKZtLMRSX4X7mfjuPfjO5A%2FvUK%2BJDmE%2Bp3%2Ff4H%2FOHpD%2FmeD%2FC9859HdleSvkEoyPap4l8GbymA28icgCv%2B5DGzR0JABOQh2IMs9Txw%2FZqqigcN7qt%2F7vTBF02BoEJStt1j77ocbzDcCSfxqi9Hl9vzGGSBd3JsWBGGPUa5zwBpVLb4pdo1Bd1luJ5HL8xDBphI7ZlSRNWSd7j3CAVLX9iqv6%2F7%2FYEUdv1pFHXuditoeyBqJGUwHEjN275CY0cD3uc93StQXxLHI4WsNxzt%2B1zzA9PCSg%2Fck%2FcUkHccVwC0C3hP3lxN3Frxd4toD3EsnYcLxo74KgxamKBccf82ormSgQ99mGNagZYLlhx0%2BR1Lo3cjJbJgTiLs8f9MGD67nWeC71tOD5%2FkWWBFJIV76lqkUGjlR9a3xXg2IapIJ7l31dSiGqIm9TEi7WFFIwnfv5VqqQbVnaZWEIUUP7TmHuDbuVrqObMgq6MgqDNouqrWaUc2Lva6jjj6nHdlV%2B%2Bv5KZVXb3GcGP3%2FsxjbQoxeQ3HRgOImb6e47p1et%2BQfq7hwEnQcBaMkB8JA54aZOVldXXA0aS8YFPjiurr23iTsKL5awUj9Q%2FNyPV%2BZX%2F4JEnz8Cw%3D%3D%3C%2Fdiagram%3E%3Cdiagram%20id%3D%223c369dc2-d054-91be-35a6-1d78f60ecb7c%22%20name%3D%22Gameboard%20Update%22%3E7VlRc6M2EP41nmkfygACbD8mvsvdw3UmM3lo%2ByiDAroDiRNybPfXdwUSSAaumZhM07mQSSKtFkm73%2BrbtbxCu%2Br0SeC6%2BJ1npFyFfnZaoQ%2BrMAzWfgL%2FlOTcSZIAdYJc0EwrDYIH%2BjfRQl9LDzQjjaMoOS8lrV1hyhkjqXRkWAh%2BdNUeeemuWuOcjAQPKS7H0j9oJgstDZLtMPCZ0LwwSydx2I3scfotF%2FzA9IKrED22TzdcYTOZtrQpcMaPlgh9XKGd4Fx2req0I6VyrvFb997dzGi%2FcUGYfM4LcffCEy4PxOy43Zc8G2coc2qtRoQkpykI8N6o%2B%2BMtBL1hEDGEV0SKM6joieKtfkUHCzL94%2BD6yERGYXvd10Ks4c77uQeLoaGNnnZAOHLAV74HwfcDAUHoc0AuKWHF24w%2BQTNXzUOdYUlZruKyUFo5rsieY5EZZVjW0h%2F5tI0Qorbgw%2FCxoJI81DhVo0c4UiArZAVb%2FhBAs48RpdtIwb%2BRHS%2B5aKdCfvv0IyZeweG3j7QsLc279gF5LnBGAR0zxjgjSp0zeYcrWiogvhxSmmHY9Y6zhpdmXJ%2FVYKP7F1PMhokdDvF0ONhw%2B6EXR9ZPMkZ%2FuwD46N%2BjXwqKWd7a%2Fw6TdWrXXuQgFDtnOB6f4I2H%2FLG%2BjehmAUSjd0RfiiiKkOfHm6D%2FeRuIbkYAkgySte5q810%2BtSAE28X5Ty1vO3%2BpjhdD9yuR8qz9ig%2BSg4gLWfCcM1x%2B4bw2YfBM5IMloVRGzgKpRQ0%2FiFRrrXWZhEVOpJXaxnALUkLyenJnvwah9WQKRTcg%2B%2BVX%2BNPKElyp06XTof8JEuZtlzBnU2Pw853QH1dKKHQrpcgfn0qwenwOkwXOYTBOlp7njdmVnOQFRg4sxqGW%2F7UIlzRn0E3BGwTkt8pXFIryGz1Q0SybpW2XAZy4eBvg9SAY8IKJMncCu3CJIje6jkRPVPYcCu23Q6HRkhTaZbwrCFO%2Fes8prDIAv748tReIdpyt3xpAvRECny21Wik08%2BtEkbuOCbi7Z%2Boj9GP98Ep9Y%2FcQs52FQwT3Pn8eIW1GhEQVc0D%2Ftz1uIJAhBJ54eZCUs1H8A0PUqtnRlZt0rNCfopoMN0Wvqzr3WMK6rJWEfvTT5aV441b%2FPWfZeWnqE%2FwS9aH5EPdCbvuvGWzRIvDqkm%2FmJMcXJzl6HQYL%2Fel1lmKMicsec1%2FT1JiZ25q6xGcimtbdMi3UJRfMo%2FqAE%2B%2FvfC7ve%2Bwp3unmFelm40ZJHE%2BwzVQVvAjbJP9rtpmpl%2FoCzwtNvadqvMDzUaj790RQ8JYqzFujXkhQM1cQ1xJUsPW21rNeuzxyWUMvxFcBiifXWYyvxrfzArOMVxYltRTV1jpT5OQfC8KURfDLyFHpt%2BSmoFO1UvNOVK9IVBef%2BIIJokLJBFG95IsN6A7fGnWxNnw3hz7%2BAw%3D%3D%3C%2Fdiagram%3E%3Cdiagram%20id%3D%2275b3910a-fef7-363b-02b9-9b51502e72cc%22%20name%3D%22Page-4%22%3E7VnBctsgEP0aXzsCJEs%2Bpm6SHtKZzOTQ5kgkItFgocEotvv1BQksIZTGiZWkM7EuEQ9Ysby3uwTP0HK1vRS4Kn7wjLAZDLLtDH2bQQjAIlR%2FNLJrkRAuWiAXNDODOuCG%2FiEGDAxa04ysnYGScyZp5YIpL0uSSgfDQvCNO%2ByeM%2FerFc6JB9ykmPnoT5rJwvo1X3Qd3wnNC%2FvpeQTbnjucPuSC16X54Ayi%2B%2BZpu1fYGjOerguc8U0PQucztBScy%2FZttV0SpjfX7ls77%2BKJ3v3CBSnlIRNQO%2BERs9r4PkNnS0b19HaBcmd3Ra210q%2Bi2fKvhVwx1QLqdVNQSW4qnOrujdKEwjCjeamaqTJFhAL2rga6IQV%2FIEvOuGiMo6B59j1229Vyvt5TxnojL5pH4bnAmV6o7St5SfRwXsoLvKJMi%2B%2BqTmmGlR9LXq45s%2F1GciAx7YEJsylESLJ9cmPBni4VB4SviBQ7NcRMWBiCbQSY5qYnp7nBip6SLIaNgvO94Y5E9WJ4HOd07nF6iVfkROcxdMbhx%2FG58Pgkj82yz7oUSHmpGmQt8R2j64JkT9JNtprtJkWRzBD%2BDPcZbiy2A3TjGkslgrJBYBD%2Bp2oI30wNKEKOGmJfDTCJfDWgCdQAoEctyVT1Mk3jZMdv4PKrPBS7Xxr%2FAuaxBW5bAEYWuCaCqqXpSG8s%2FCZS7szG4lpyBXEhC57zErMrzitj%2FlDqwZRcav9fyqQgDEv66M4b48VMveZUl0SrABhGjgJAPKB2zWuREjOrX4AHhmIY%2F9uQxCIn0jPUyGTvz2HK8Yt9aip9UAmuItEvEm6eGEsOPW19siSQJC5zcKQmjGWBcIosMD8qC5zCeRiFbnn3ODo0nGH0jKEJwzn2wrlieKdSdnMqkLrQn8L58HAGLnNg8Z7hnPipuRaizc15c3pXNGJ5StAvYDT6SEZtQhk%2FtbuUBnWVjXF7OrJPGN7xIDEnI2f28I3O7Ha5p2o9TbUG7uEbJa%2Bt1uEzhqar1iM3bacMf2xQh4Eb1Ai9Z4aPPEb9KC%2BzM30f3XntJOY%2Bce8bu71rgP3%2F%2FLfG%2FKFxDYM2PMzejzPVYyIauR%2Bz2JEZAQyyexi9MiOAwb0tGF7gTZgR%2FHvaz6WfjxJLAicSy9AQCKYSi2p2vwG1w7tf2tD5Xw%3D%3D%3C%2Fdiagram%3E%3C%2Fmxfile%3E)

To enable easier testing and debug, the following items were intentionally designed as injected dependencies upon the creation of a __:Game__ instance.

  - `evolveFunc: (board: GameBoard) => GameBoard`: the logic of natural evolution
  - `getRandomPattern: (board: GameBoard) => Pattern`: random pattern generator,it can be mocked with a function which returns known pattern series during testing
  - `eventBus: IEventBus`: mainly used to broadcast game state updates
  - `evolveTimer: IIntervalLoopSetter`: An interface does similar function as native JS `setInterval`, by mocking this object, you can manually control how the board updates during testing/debugging
  - `jobQueueTimer: IIntervalLoopSetter`: An interfae does similar function as native JS `setInterval`, by mocking this object, you can decide the behaviour of how job is dequeued and consumed

By using these injection you can simulate a completely predicatable test against the state changes of the game board.


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
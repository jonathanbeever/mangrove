# Mangrove ‒ Server

## Prerequisites
In order to run the server there are three prerequisites that must be installed and accessible via the command line (i.e. included in your PATH):
* [MongoDB](https://www.mongodb.com)
* [Redis](https://redis.io) (Windows users should get a stable build from [here](https://github.com/MicrosoftArchive/redis/releases))
* The [R programming language](https://www.r-project.org/)

It can be convenient to run MongoDB and Redis as daemons/services. Otherwise, it's fine to run them individually:
```
$ mongod
```
```
$ redis-server
```

Assuming you've cloned this repository and have a terminal open to this directory, you can install the server:
```
$ npm install
```

Finally, before running the server, note that the server may initially fail to process jobs. This is because the `r-script` package has not yet had a chance to install the necessary R packages. You can avoid trouble by running the tests (see the **Testing** section below for instructions) consecutively until all tests pass. This will usually take 1-2 runs. Note that Windows users must do this in an Administrator terminal. Once all tests pass, the server can be run normally (at the user level).

## Production
To run the server in a production environment, get your instances of MongoDB and Redis going and run:
```
$ npm start
```

## Development
During development, always run the server in a development environment. This allows for auto-refresh on file changes (i.e. hot reloading).

To run the server in a development environment, get your instances of MongoDB and Redis going and run:
```
$ npm run dev
```

### Updating packages
This application requires manual dependency updates. The easiest way to do this is to globally install the `npm-check-updates` package to your system and to periodically run `ncu` in this directory to find packages that are ready to be updated. Do not install this package to the project.
```
$ npm install -g npm-check-update
$ ncu
```

### Testing
Always run tests before you commit/push code.

To run tests, including linting:
```
$ npm test
```

To fix linting errors:
```
$ npm run lint-fix
```

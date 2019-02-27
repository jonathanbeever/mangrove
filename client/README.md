# Mangrove ‒ Client

## Prerequisites
Assuming you've cloned this repository and have a terminal open to this directory, you can install the client:
```
$ npm install
```

## Development
To run the client application in Electron with hot reloading run:
```
$ npm run electron-dev
```

### Updating packages
This application requires manual dependency updates. The easiest way to do this is to globally install the `npm-check-updates` package to your system and to periodically run `ncu` in this directory to find packages that are ready to be updated. Do not install this package to the project.
```
$ npm install -g npm-check-update
$ ncu
```

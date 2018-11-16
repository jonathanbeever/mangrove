# Fall2018-Group11
## Soundscape Ecology Server

### Production
To run the server for a production environment, get a MongoDB daemon/service going and run:
```
$ npm start
```

### Development
During development, always run the server in a development environment. This allows for auto-refresh on file changes (i.e. hot reloading).

To run the server in a development environment, get a MongoDB daemon/service going and run:
```
$ npm run dev
```

#### Testing
Always run tests before you commit/push code.

To run tests, including linting:
```
$ npm test
```

To fix linting errors:
```
$ npm run lint-fix
```

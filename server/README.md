# Mangrove Server

## Installation

There are two options for installing the Mangrove server:
1. **Docker** ‒ This is the easiest way to use the server, but it requires one of the following operating systems:
   - Windows 10 Pro or Enterprise
   - MacOS 10.12 Sierra or higher
   - Linux (any variety)
2. **Manual** ‒ This method will work for all operating systems, but requires more effort.

### Prerequisites

Regardless of how you intend to run the server (Docker or not), you'll need two to three things no matter what: `git` and `node`/`npm`. Usually, `node` and `npm` are packaged together and will not need to be installed individually.

Install these dependencies. Once installed, they must be accessible via the command line (i.e. included in your PATH). Usually this happens automatically (or sometimes as an option) during installation. You can check that it worked by opening up a terminal and running the following:
```
$ git --version
$ node --version
$ npm --version
```

If any of those commands fails (doesn't print out a version number), be sure to add it to the PATH according to your operating system. Once you've got these commands working, you can move on.

Next, you'll need to clone this repository. In a terminal, `cd` into the directory where you want to store Mangrove itself. For example, I'll go to `Desktop` inside my home directory (i.e. `~` on Mac and Linux, `%USERPROFILE%` on Windows):
```
$ cd ~/Desktop
```
Once you're there, you can clone this repository:
```
$ git clone https://github.com/ucfcs/Fall2018-Group11
```
That will create the `~/Desktop/Fall2018-Group11` directory, containing the entirety of Mangrove. We can then go into the server and install its dependencies using `npm`:
```
$ cd Fall2018-Group11/server
$ npm install
```

Wait for `npm` to finish running. Once it's done, proceed to either **Docker Installation** or **Manual Installation** below, depending on which one you've chosen.

### Docker Installation

Install the Docker version appropriate to your operating system:
* Windows ‒ [Docker Desktop for Windows](https://hub.docker.com/editions/community/docker-ce-desktop-windows) (requires 10 Pro or Enterprise)
* MacOS ‒ [Docker Desktop for Mac](https://hub.docker.com/editions/community/docker-ce-desktop-mac) (requires 10.12 Sierra or higher)
* Linux ‒ You don't need my help for this

Once Docker is successfully installed, make sure the Docker service is running before you proceed to the **Running the Server** section below. If this service isn't running, then the server can't run (we're stranded!). You may choose to have Docker run as a service/daemon (in the background) each time you boot your machine, or you can start it manually each time you run the server.

### Manual Installation

There are three additional prerequisites that must be installed and accessible via the command line (i.e. stored in your PATH). Consult the documentation for each of these for help with installation:
- [MongoDB](https://www.mongodb.com)
- [Redis](https://redis.io) (Windows users should get a stable build from [here](https://github.com/MicrosoftArchive/redis/releases))
- The [R programming language](https://www.r-project.org/)

#### Windows Only
If you are running windows you will need to manually install Rtools. This allows the application to download our [modified R scripts](https://github.com/OtGabaldon/soundecology) from github. Download the most recent stable version from [here](https://cran.r-project.org/bin/windows/Rtools/). **When prompted during installation, select the Add to Path option**

Similar to `git`, `node,` and `npm`, we should check to make sure they installed correctly and can be used from the terminal:
```
$ mongod --version
$ redis-server --version
$ R --version
```

Once these are successfully installed, you have an option: Either you can run MongoDB and Redis as services/daemons (in the background) or you can run them manually in a terminal each time you run the server.

If you do the former, it will save you time. This is the recommended approach. Consult the documentation for MongoDB and Redis for instructions on how to do this for your operating system.

On the other hand, if you can't or don't want to run MongoDB and/or Redis as daemons/services, it's fine to run them in individual terminals before starting the server itself, and you'll need to do this *each time* before you run the server:
```
$ mongod
```
```
$ redis-server
```

In either case, you can check that they're running by executing the following commands:
```
$ mongo
$ redis-cli -r 1 PING
```
If MongoDB is running, executing `mongo` will place you in the MongoDB shell, which you can exit with Ctrl+D. Otherwise, it will fail with a connection failed error. If Redis is running `redis-cli -r 1 PING` will print out `PONG`. Otherwise, it will fail with a connection refused error.

Finally, before running the server, note that the server may initially fail to process jobs. This is because the `r-script` package has not yet had a chance to install the necessary R packages. You can avoid trouble by running the tests (see the **Testing** section below for instructions) consecutively until all tests pass. This will usually take 1-2 runs. Note that Windows users must do this in an Administrator terminal. Once all tests pass, the server can be run normally (at the user level).

## Running the Server

Once you've finished installing all requirements, you're ready to run the Mangrove server. Open a terminal and `cd` into the `server` directory of your Mangrove installation (recall this from the **Prerequesites** section).

If you're working on the development of the Mangrove server, you'll want to read the rest of this document. Otherwise, the **Production** section below should suffice on its own.

### Production

To run the server in a production environment:
```
# For Docker, use
$ npm run docker-start

# For manual install, use
$ npm start
```

### Development

During development, always run the server in a development environment. This allows for auto-refresh on file changes (i.e. hot reloading).

To run the server in a development environment:
```
# For Docker, use
$ npm run docker-dev

# For manual install, use
$ npm run dev
```

#### Testing

Always run tests before you commit/push code.

To run tests, including linting:
```
# For Docker, use
$ npm run docker-test

# For manual installation, use
$ npm test
```

To fix linter errors:
```
$ npm run lint-fix
```

#### Updating packages

This application requires manual dependency updates. The easiest way to do this is to globally install the `npm-check-updates` package to your system and to periodically run `ncu` in this directory to find packages that are ready to be updated. Do not install this package to the project.
```
$ npm install -g npm-check-update
$ ncu
```

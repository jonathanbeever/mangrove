## Setting up your Development Environment

## Setting up your Local

1. If you are using Windows, follow the steps [here](https://docs.microsoft.com/en-us/windows/wsl/install) to install and setup WSL2 using Ubuntu.
    1. Optionally install [Windows Terminal](https://aka.ms/terminal).
2. Install [Docker Desktop](https://www.docker.com/get-started) for Windows or macOS, or install [Docker Engine](https://docs.docker.com/engine/install/) for Linux.
    1. If you are using Linux, make sure to follow the "Manage Docker as non-root user" post-installation steps [here](https://docs.docker.com/engine/install/).
3. Restart your computer.
4. Open this repository in VSCode and you will be prompted to install the "Remote - Containers" extension unless you already have it installed.
    1. PHPStorm is also recommended, the .idea folder in the root of this project contains project-level configuration that will apply to your PHPStorm when opening this repository. If you are using PHPStorm you can skip step 5.
5. Copy the ```.env.example``` file in the root of the project into a new file called ```.env```.
6. Once the "Remote - Containers" extension is installed, you will be prompted to "Reopen in Container", do that.
    1. This may take a few minutes the first time as it is building the docker image that will be used to host the application.
    2. This will also install the VSCode extensions you will need to work with this repository.
    3. Additional extensions can also be installed alongside the required defaults.
7. After the container finishes building for the first time, run ```php artisan migrate``` to run the database migrations.
8. Install Composer and NPM packages through the docker terminal:
   > composer install
   >
   > npm install && npm run dev

## Using your Local

1. Open the repository in your IDE.
    1. If you are not using the VSCode Container, also start the docker config created in the "Setting up your Local" section.
2. Run ```npm run watch``` in a terminal at the project root and every time you change and save a file, your assets will recompile and sync with your browser.

## Recommended Learning Resources

- Laravel
    - [Documentation](https://laravel.com/docs/8.x)
    - [Laracasts Series](https://laracasts.com/series/laravel-8-from-scratch)
    - [Artisan](https://laravel.com/docs/8.x/artisan)
    - [Sail](https://laravel.com/docs/8.x/sail)
      - Docker Management
      - To share your local site with others, or to enable https on your local site, see [this](https://laravel.com/docs/8.x/sail#sharing-your-site) section.
      - To set up Xdebug, see [this](https://laravel.com/docs/8.x/sail#debugging-with-xdebug) section.
- Inertia.js
    - [Documentation](https://inertiajs.com/)
    - [Laracasts Series](https://laracasts.com/series/build-modern-laravel-apps-using-inertia-js)
- PHP Testing
    - [Laracasts Series](https://laracasts.com/series/php-testing-jargon)
- Pest (Simplified PHP Testing)
    - [Documentation](https://pestphp.com/docs/writing-tests)
    - [Laracast Video](https://laracasts.com/series/andres-larabits/episodes/3)
- Vue.js 3
    - [Documentation](https://v3.vuejs.org/guide/introduction.html)
    - [freeCodeCamp Series](https://youtu.be/FXpIoQ_rT_c)
- [freeCodeCamp](https://www.youtube.com/c/Freecodecamp)
- [Laracasts](https://laracasts.com/series)

## Troubleshooting
- Docker container crashing in state "undefined"
    - Run `./vendor/bin/sail up --build`
FROM ubuntu:20.04

ARG WWWGROUP
ARG NODE_VERSION=16

WORKDIR /var/www/html

ENV DEBIAN_FRONTEND noninteractive
ENV TZ=UTC

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update \
    && apt-get install -y gnupg gosu curl ca-certificates zip unzip git supervisor sqlite3 libcap2-bin libpng-dev python2 \
    libcurl4-gnutls-dev libxml2-dev libssl-dev libgit2-dev dirmngr wget \
    && mkdir -p ~/.gnupg \
    && chmod 600 ~/.gnupg \
    && echo "disable-ipv6" >> ~/.gnupg/dirmngr.conf \
    && wget -qO- https://cloud.r-project.org/bin/linux/ubuntu/marutter_pubkey.asc | tee -a /etc/apt/trusted.gpg.d/cran_ubuntu_key.asc \
    && echo "deb https://cloud.r-project.org/bin/linux/ubuntu focal-cran40/" > /etc/apt/sources.list.d/r-project.list \
    && apt-key adv --homedir ~/.gnupg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys F142A4D99F16EB04 \
    && echo "deb https://ppa.launchpadcontent.net/c2d4u.team/c2d4u4.0+/ubuntu focal main" > /etc/apt/sources.list.d/r-project-packages.list \
    && apt-key adv --homedir ~/.gnupg --keyserver hkps://keyserver.ubuntu.com --recv-keys 14AA40EC0831756756D7F66C4F4EA0AAE5267A6C \
    && echo "deb https://ppa.launchpadcontent.net/ondrej/php/ubuntu focal main" > /etc/apt/sources.list.d/ppa_ondrej_php.list \
    && apt-get update \
    && apt-get install -y php8.1-cli php8.1-dev \
       php8.1-pgsql php8.1-sqlite3 php8.1-gd \
       php8.1-curl \
       php8.1-imap php8.1-mysql php8.1-mbstring \
       php8.1-xml php8.1-zip php8.1-bcmath php8.1-soap \
       php8.1-intl php8.1-readline \
       php8.1-ldap \
       php8.1-msgpack php8.1-igbinary php8.1-redis php8.1-swoole \
       php8.1-memcached php8.1-pcov php8.1-xdebug \
    && php -r "readfile('https://getcomposer.org/installer');" | php -- --install-dir=/usr/bin/ --filename=composer \
    && curl -sL https://deb.nodesource.com/setup_$NODE_VERSION.x | bash - \
    && apt-get update \
    && apt-get install -y nodejs \
    && npm install -g npm \
    && apt-get install -y mysql-client \
    && apt-get install -y --no-install-recommends r-base r-base-dev r-cran-tuner r-cran-devtools r-cran-rjson r-cran-vegan r-cran-seewave r-cran-permute \
    r-cran-rcpp r-cran-gsw r-cran-ineq r-cran-oce r-cran-pracma \
    && apt-get -y dist-upgrade \
    && apt-get -y autoremove \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY install-deps.R /tmp/install-deps.R
RUN Rscript /tmp/install-deps.R

RUN setcap "cap_net_bind_service=+ep" /usr/bin/php8.1

RUN groupadd --force -g $WWWGROUP sail
RUN useradd -ms /bin/bash --no-user-group -g $WWWGROUP -u 1337 sail

COPY start-container.sh /usr/local/bin/start-container
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY supervisord-worker.conf /etc/supervisor/conf.d/supervisord-worker.conf
COPY php.ini /etc/php/8.1/cli/conf.d/99-sail.ini
RUN chmod +x /usr/local/bin/start-container

EXPOSE 8000

ENTRYPOINT ["start-container"]

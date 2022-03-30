#!/usr/bin/env bash

if [ ! -z "$WWWUSER" ]; then
    usermod -u $WWWUSER sail
fi

if [ ! -d /.composer ]; then
    mkdir /.composer
fi

chmod -R ugo+rw /.composer

if [ $# -gt 0 ]; then
    exec gosu $WWWUSER "$@"
else
    role=${CONTAINER_ROLE:-app}

    if [ "$role" = "app" ]; then
        /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
    elif [ "$role" = "worker" ]; then
        /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord-worker.conf
    fi
fi

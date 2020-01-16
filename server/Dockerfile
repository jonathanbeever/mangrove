FROM archlinux/base

RUN pacman -Syyu --noconfirm

RUN ["pacman", "-S", "--noconfirm", "--needed", "base-devel", "gcc-fortran"]

RUN ["pacman", "-S", "--noconfirm", "npm", "r"]
COPY ./scripts/install-dependencies.R /
RUN ["Rscript", "/install-dependencies.R"]

WORKDIR /mangrove/server

ENTRYPOINT ["npm", "run"]
CMD ["start"]

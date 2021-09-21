FROM archlinux/base

WORKDIR /

COPY package*.json ./

RUN ["pacman", "-Sy", "archlinux-keyring", "--noconfirm"]
RUN ["pacman", "-Syyu", "--noconfirm"]

RUN ["pacman", "-S", "--noconfirm", "--needed", "base-devel", "gcc-fortran"]

RUN ["pacman", "-S", "--noconfirm", "npm", "r"]

RUN ["npm", "install"]

COPY . .

COPY ./scripts/install-dependencies.R /
RUN ["Rscript", "/install-dependencies.R"]

ENTRYPOINT ["npm", "run"]
CMD ["start"]

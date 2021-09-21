install.packages(c("tuneR",
                   "devtools"),
                 dependencies=TRUE,
                 repos="https://cloud.r-project.org")
devtools::install_github("OtGabaldon/soundecology",
                         ref="a78393ab9929955a0151e5766a08bfbdef168ecd",
                         subdir="soundecology")

rootMeanSquare <- function(soundfile) {
  rmsL <- sqrt(mean(soundfile@left^2))
  rmsR <- sqrt(mean(soundfile@right^2))

  list(rmsL = rmsL, rmsR = rmsR)
}

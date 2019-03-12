needs("soundecology")
needs("tuneR")

job <- input[[1]]

soundfile <- readWave(job$input$path)

if (job$spec$type == "aci") {
  result <- acoustic_complexity(soundfile,
                                min_freq = job$spec$minFreq,
                                max_freq = job$spec$maxFreq,
                                j = job$spec$j,
                                fft_w = job$spec$fftW)
  names(result) <- c("aciTotAllL",
                     "aciTotAllR",
                     "aciTotAllByMinL",
                     "aciTotAllByMinR",
                     "aciFlValsL",
                     "aciFlValsR",
                     "aciMatrixL",
                     "aciMatrixR")
  result$aciMatrixL <- as.matrix(sapply(result$aciMatrixL, as.numeric))
  result$aciMatrixR <- as.matrix(sapply(result$aciMatrixR, as.numeric))
}
if (job$spec$type == "adi") {
  result <- acoustic_diversity(soundfile,
                               max_freq = job$spec$maxFreq,
                               db_threshold = job$spec$dbThreshold,
                               freq_step = job$spec$freqStep,
                               shannon = job$spec$shannon)
  names(result) <- c("adiL",
                     "adiR",
                     "bandL",
                     "bandR",
                     "bandRangeL",
                     "bandRangeR")
}
if (job$spec$type == "aei") {
  result <- acoustic_evenness(soundfile,
                              max_freq = job$spec$maxFreq,
                              db_threshold = job$spec$dbThreshold,
                              freq_step = job$spec$freqStep)
  names(result) <- c("aeiL",
                     "aeiR")
}
if (job$spec$type == "bi") {
  result <- bioacoustic_index(soundfile,
                              min_freq = job$spec$minFreq,
                              max_freq = job$spec$maxFreq,
                              fft_w = job$spec$fftW)
  names(result) <- c("areaL",
                     "areaR")
}
if (job$spec$type == "ndsi") {
  result <- ndsi(soundfile,
                 fft_w = 1024,
                 anthro_min = 1000,
                 anthro_max = 2000,
                 bio_min = 2000,
                 bio_max = 11000)
  names(result) <- c("ndsiL",
                     "ndsiR",
                     "biophonyL",
                     "anthrophonyL",
                     "biophonyR",
                     "anthrophonyR")
}

result

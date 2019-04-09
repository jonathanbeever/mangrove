job <- input[[1]]

needs("tuneR")
if (job$spec$type %in% list("aci", "adi", "aei", "bi", "ndsi")) {
  needs("devtools")
  if(!"soundecology" %in% rownames(installed.packages()))
    devtools::install_github("OtGabaldon/soundecology",subdir="soundecology",quiet = TRUE)

  needs("soundecology")
  if (job$spec$type == 'aci')
    source("./util/jobProcessor/R/nyquist.R")
} else if (job$spec$type %in% list("rms")) {
  source("./util/jobProcessor/R/rootMeanSquare.R")
} else
  throw('Invalid `type` provided: ', job$spec$type)

soundfile <- readWave(job$input$path)

if (job$spec$type == "aci") {
  maxFreq <- if (job$spec$maxFreq >= 0) job$spec$maxFreq
             else getNyquistFrequency(job)
  result <- acoustic_complexity(soundfile,
                                minFreq = job$spec$minFreq,
                                maxFreq = maxFreq,
                                j = job$spec$j,
                                fft_w = job$spec$fftW,
                                matrix=FALSE,
                                bands=TRUE)
} else if (job$spec$type == "adi") {
  result <- acoustic_diversity(soundfile,
                               max_freq = job$spec$maxFreq,
                               db_threshold = job$spec$dbThreshold,
                               freq_step = job$spec$freqStep,
                               shannon = job$spec$shannon)
} else if (job$spec$type == "aei") {
  result <- acoustic_evenness(soundfile,
                              max_freq = job$spec$maxFreq,
                              db_threshold = job$spec$dbThreshold,
                              freq_step = job$spec$freqStep)
} else if (job$spec$type == "bi") {
  result <- bioacoustic_index(soundfile,
                              min_freq = job$spec$minFreq,
                              max_freq = job$spec$maxFreq,
                              fft_w = job$spec$fftW)
} else if (job$spec$type == "ndsi") {
  result <- ndsi(soundfile,
                 fft_w = 1024,
                 anthro_min = 1000,
                 anthro_max = 2000,
                 bio_min = 2000,
                 bio_max = 11000)
} else if (job$spec$type == "rms") {
  result <- rootMeanSquare(soundfile)
}
return (result)

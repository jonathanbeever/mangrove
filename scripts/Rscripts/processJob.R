library("rjson")
library("tuneR")

runJob <- function(job) {
    if (job$spec$type != "rms") {
      source("install-deps.R")
      library("soundecology")
    }

    soundfile <- readWave(job$input$path)

    if (job$spec$type == "aci") {
      maxFreq <- if (job$spec$maxFreq >= 0) job$spec$maxFreq else job$input$sampleRateHz / 2
      result <- acoustic_complexity(soundfile,
                                    minFreq = job$spec$minFreq,
                                    maxFreq = maxFreq,
                                    j = job$spec$j,
                                    fft_w = job$spec$fftW,
                                    matrix = FALSE,
                                    bands = TRUE)
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
        rmsL <- sqrt(mean(soundfile@left^2))
        rmsR <- sqrt(mean(soundfile@right^2))

        result <- list(rmsL = rmsL, rmsR = rmsR)
    }

    return(result)
}

sink("/dev/null")
out <- suppressWarnings(runJob(fromJSON(Sys.getenv("input"))))
sink()

cat(toJSON(out))

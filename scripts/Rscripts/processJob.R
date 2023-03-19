library("rjson")
library("tuneR")
library("soundecology")
library("stats")
library("soundfile")

acoustic_helper <- function(data, indices) {

    ACI <- function() {
    data.aci <- soundecology::acoustic_complexity(data)
    return(data.aci$AciTotAll_left)
    }

    NDSI <- function() {
    data.ndsi <- soundecology::ndsi(data)
    return(data.ndsi$ndsi_left)
    }

    BI <- function() {
    data.bi <- soundecology::bioacoustic_index(data)
    return(data.bi$left_area)
    }

    ADI <- function() {
    data.adi <- soundecology::acoustic_diversity(data)
    return(data.ndsi$adi_left)
    }

    AEI <- function() {
    data.aei <- soundecology::acoustic_evenness(data)
    return(data.ndsi$aei_left)
    }

    return(get(indices)())
}

acoustic_filter <- function(dir_path, acoustic_index, max_val, timeStep) {

    if (file.access(dir_path) == -1) {
    stop(paste("The directory specified does not exist or this user is not autorized to read it:\n    ", directory))
    }

    file_Names <- list.files(path = dir_path, pattern = "\\.wav$", full.names = TRUE)

    for (fileName in file_Names) {
        audio_data <- tuneR::readWave(fileName)
        sample_rate <- audio_data@samp.rate
        bit <- audio_data@bit

        file_length <- floor(length(audio_data)/timeStep)
        subarrays <- split(audio_data, rep(1:timeStep, each=file_length,length.out = length(audio_data@left)))
        #subarrays <- split(audio_data, ceiling(seq_along(audio_data)/ts))

        # Calculates the <insert acoustic index here> for each subarray
        count <- 0
        indices <- vector("list",timeStep)
        concatenated_wav <- tuneR::Wave(rep(0, 0), samp.rate = sample_rate, bit = bit)
        for (i in seq_along(subarrays)) {
            indices[i] <- acoustic_helper(subarrays[[i]], acoustic_index)
            if (indices[i] > max_val) {
                subarrays[[i]] <- tuneR::Wave(rep(0, length(subarrays[[i]])), samp.rate = sample_rate, bit = bit)
            }
            #concatenated_wav <- c(concatenated_wav,subarrays[[i]])
            concatenated_waveform <- c(as.vector(concatenated_wav@left), as.vector(subarrays[[i]]@left))
            concatenated_wav <- tuneR::Wave(concatenated_waveform, samp.rate = sample_rate, bit = bit)
            count <- count + file_length
        }

        temp_filePath <- file.path(dir_path,fileName)
        tuneR::writeWave(concatenated_wav, filename = fileName, sample_rate)

    }

}

frequency_filter <-function(dir_path, min_freq, max_freq) {
    if (file.access(dir_path) == -1) {
		stop(paste("The directory specified does not exist or this user is not autorized to read it:\n    ", directory))
		}
    file_Names <- list.files(path = dir_path, pattern = "\\.wav$", full.names = TRUE)

    for (fileName in file_Names) {
        audio_data <- tuneR::readWave(fileName)
        tuneR::normalize(audio_data, unit = c("1"), center =FALSE, rescale = FALSE) # the interval chosen is [-1,1]
        sample_rate <- audio_data@samp.rate

        fourier <- stats::fft(audio_data) # fourier transformation

        # Frequencies
        freq <- stats::fftfreq(n=length(audio_data), d=0.1)

        # Filtering the sample
        fourier[freq < min_freq] <- 0 #High Pass filter
        fourier[freq > max_freq] <- 0 # Low pass filter

        filtered_wav <- stats::Re(stats::ifft(fourier)) # Inverse fourier transformation
        tuneR::writeWave(filtered_wav, filename = fileName, sample_rate)
    }
}


runJob <- function(job) {
    result <- list("aci" = NULL, "adi" = NULL, "aei" = NULL, "bi" = NULL, "ndsi" = NULL, "rms" = NULL,"acousticFilter" = NULL,"frequencyFilter" = NULL)

    for (input in job$inputs) {
        if (input$type == "aci") {
            result[["aci"]] <- multiple_sounds(directory = job$meta$path,
                                               soundindex = input$name,
                                               no_cores = job$meta$cores,
                                               min_freq = input$min_freq,
                                               max_freq = input$max_freq,
                                               j = input$j,
                                               fft_w = input$fftw,
                                               matrix = FALSE,
                                               bands = TRUE)
        } else if (input$type == "adi") {
            result[["adi"]] <- multiple_sounds(directory = job$meta$path,
                                               soundindex = input$name,
                                               no_cores = job$meta$cores,
                                               max_freq = input$max_freq,
                                               db_threshold = input$db_threshold,
                                               freq_step = input$freq_step,
                                               shannon = input$shannon)
        } else if (input$type == "aei") {
            result[["aei"]] <- multiple_sounds(directory = job$meta$path,
                                               soundindex = input$name,
                                               no_cores = job$meta$cores,
                                               max_freq = input$max_freq,
                                               db_threshold = input$db_threshold,
                                               freq_step = input$freq_step)
        } else if (input$type == "bi") {
            result[["bi"]] <- multiple_sounds(directory = job$meta$path,
                                              soundindex = input$name,
                                              no_cores = job$meta$cores,
                                              min_freq = input$min_freq,
                                              max_freq = input$max_freq,
                                              fft_w = input$fftw)
        } else if (input$type == "ndsi") {
            result[["ndsi"]] <- multiple_sounds(directory = job$meta$path,
                                                soundindex = input$name,
                                                no_cores = job$meta$cores,
                                                fft_w = input$fftw,
                                                anthro_min = input$anthro_min,
                                                anthro_max = input$anthro_max,
                                                bio_min = input$bio_min,
                                                bio_max = input$bio_max)
        } else if (input$type == "rms") {
            result[["rms"]] <- multiple_sounds(directory = job$meta$path,
                                                soundindex = input$name,
                                                no_cores = job$meta$cores)
        } else if (input$type == "acousticFilter") {
            acoustic_filter(directory = job$meta$path,
                            soundindex = input$soundindex,
                            max_val = input$max_val,
                            timeStep = input$timeStep)
        } else if (input$type == "frequencyFilter") {
            frequency_filter(directory = job$meta$path,
                             min_freq = input$min_freq,
                             max_freq = input$max_freq)
        }

    }

    return(result)
}

sink("/dev/null")
out <- suppressWarnings(runJob(fromJSON(Sys.getenv("input"))))
sink()

cat(toJSON(out))

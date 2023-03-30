library("rjson")
library("tuneR")
library("soundecology")


acoustic_helper <- function(data, indices) {

    ACI <- function() {
    data.aci <- soundecology::acoustic_complexity_index(data)
    return(data.aci$aciTotAllL)
    }

    NDSI <- function() {
    data.ndsi <- soundecology::ndsi(data)
    return(data.ndsi$ndsiL)
    }

    BI <- function() {
    data.bi <- soundecology::bioacoust_index(data)
    return(data.bi$areaL)
    }

    ADI <- function() {
    data.adi <- soundecology::acoustic_diversity(data)
    return(data.adi$adiL)
    }

    AEI <- function() {
    data.aei <- soundecology::acoustic_evenness(data)
    return(data.aei$aeiL)
    }

    return(get(indices)())
}

acoustic_filter <- function(dir_path, acoustic_index, max_val, timeStep) {

    if (file.access(dir_path) == -1) {
    stop(paste("The directory specified does not exist or this user is not autorized to read it:\n    ", directory))
    }

    file_Names <- list.files(path = dir_path, pattern = "\\.wav$", full.names = TRUE)

    for (file_name in file_Names) {
        audio_data <- tuneR::readWave(file_name)
        sample_rate <- audio_data@samp.rate
        bit <- audio_data@bit

        file_length <- floor(length(audio_data)/timeStep)
        subarrays <- split(audio_data, rep(1:timeStep, each=file_length,length.out = length(audio_data@left)))

        filtered_list <-list() # A list to store the filtered audio data
        concatenated_wav <- tuneR::Wave(rep(0, 0), samp.rate = sample_rate, bit = bit)

        # Calculates the <insert acoustic index here> for each subarray
        for (i in seq_along(subarrays)) {
            indices <- acoustic_helper(subarrays[[i]], acoustic_index) 
            if (indices > max_val) {
                subarrays[[i]] <- tuneR::Wave(rep(0, length(subarrays[[i]])), samp.rate = sample_rate, bit = bit)
            }
            concatenated_waveform <- c(as.vector(concatenated_wav@left), as.vector(subarrays[[i]]@left))
            concatenated_wav <- tuneR::Wave(concatenated_waveform, samp.rate = sample_rate, bit = bit)
        }
        filtered_list[[file_name]] <- concatenated_wav
        tuneR::writeWave(concatenated_wav, filename = file_name, sample_rate) # Writes new .wav
    }
}

frequency_filter <-function(dir_path, min_freq, max_freq) {
    if (file.access(dir_path) == -1) {
		stop(paste("The directory specified does not exist or this user is not autorized to read it:\n    ", directory))
		}

    file_Names <- list.files(path = dir_path, pattern = "\\.wav$", full.names = TRUE)

    for (file_name in file_Names) {
        audio_data <- tuneR::readWave(file_name)
        tuneR::normalize(audio_data, unit = c("1"), center =FALSE, rescale = FALSE) # the interval chosen is [-1,1]
        sample_rate <- audio_data@samp.rate
        bit <- audio_data@bit

        fourier <- stats::fft(audio_data@left) # fourier transformation

        # Frequencies
        freq <- (0:(length(audio_data@left)-1)) * (sample_rate / length(audio_data@left)) # Frequencies

        # Filtering the sample
        fourier[freq < min_freq] <- 0 #High Pass filter
        fourier[freq > max_freq] <- 0 # Low pass filter

        filtered_sig <- Re(signal::ifft(fourier)) # Inverse fourier transformation
        filtered_wav <- tuneR::Wave(filtered_sig, samp.rate = sample_rate, bit = bit)
        tuneR::writeWave(filtered_wav, filename = file_name, sample_rate)
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
            acoustic_filter(job$meta$path,
                            input$soundindex,
                            input$max_val,
                            input$timeStep)
        } else if (input$type == "frequencyFilter") {
            frequency_filter(job$meta$path,
                             input$min_freq,
                             input$max_freq)
        }

    }

    return(result)
}

sink("/dev/null")
out <- suppressWarnings(runJob(fromJSON(Sys.getenv("input"))))
sink()

cat(toJSON(out))

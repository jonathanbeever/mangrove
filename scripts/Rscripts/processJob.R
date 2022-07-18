library("rjson")
library("tuneR")
library("soundecology")

runJob <- function(job) {
    result <- list("aci" = NULL, "adi" = NULL, "aei" = NULL, "bi" = NULL, "ndsi" = NULL, "rms" = NULL)

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
        }
    }

    return(result)
}

sink("/dev/null")
out <- suppressWarnings(runJob(fromJSON(Sys.getenv("input"))))
sink()

cat(toJSON(out))

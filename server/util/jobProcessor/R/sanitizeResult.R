sanitizeResult <- function(result, type) {
  if (type == "aci") {
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
  } else if (type == "adi") {
    names(result) <- c("adiL",
                       "adiR",
                       "bandL",
                       "bandR",
                       "bandRangeL",
                       "bandRangeR")
  } else if (type == "aei") {
    names(result) <- c("aeiL",
                       "aeiR")
  } else if (type == "bi") {
    names(result) <- c("areaL",
                       "areaR")
  } else if (type == "ndsi") {
    names(result) <- c("ndsiL",
                       "ndsiR",
                       "biophonyL",
                       "anthrophonyL",
                       "biophonyR",
                       "anthrophonyR")
  }

  result
}

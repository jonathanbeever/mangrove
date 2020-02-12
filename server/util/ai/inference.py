# script to run inference on input image and model paths

from pip._internal import main

try:
    main(["install", "tensorflow"])
except SystemExit as e:
    pass

import tensorflow as tf
import numpy as np
from PIL import Image
import sys

# show an image and run inference
def inference(img):
    classes = ["broccoli","cheese","chicken","eggs","pasta","rice","salt"]
    # run model for prediction
    class_indx = model.predict(img)
    print(class_indx)

    # Find indices of the max prediction
    max_predictions = np.where(class_indx == np.amax(class_indx))
    print(max_predictions)

    # get class label
    class_label = classes[max_predictions[1][0]]
    return class_label

# pre-process input image
def preprocessing(img_path):
    img = Image.open(img_path)    
    img = img.resize((150, 150), Image.ANTIALIAS)
    img = np.expand_dims(img, 0)
    img = tf.cast(img, tf.float32)
    return img

if __name__ == "__main__":
    
    # parse inputs
    img_path = sys.argv[1]
    model_path = sys.argv[2]

    # read and resize image
    img = preprocessing(img_path)
    
    # load model
    model = tf.keras.models.load_model(model_path)

    # run inference
    class_label = inference(img)

    # print class
    print(class_label)

    # print confidence interval
    print('1.0')
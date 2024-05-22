import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.datasets import mnist

# Load the MNIST dataset
(x_train, y_train), (x_test, y_test) = mnist.load_data()

# Normalize the images to the range of [0, 1]
x_train, x_test = x_train / 255.0, x_test / 255.0

# Save training and test data
np.save('x_train.npy', x_train)
np.save('y_train.npy', y_train)

np.save('x_test.npy', x_test)
np.save('y_test.npy', y_test)

# Convert NumPy arrays to lists
x_train_list = x_train.tolist()
y_train_list = y_train.tolist()

x_test_list = x_test.tolist()
y_test_list = y_test.tolist()

mnist_data = {
    "training": {
        "input": x_train_list,
        "label": y_train_list
    },
    "test": {
        "input": x_test_list,
        "label": y_test_list
    }
}

# Save as JSON
with open('mnist_data.json', 'w') as f:
    json.dump(mnist_data, f)

import tensorflow as tf

# Load model
model = tf.keras.models.load_model("sign_model.h5")

# Build (ensures summary works)
model.build()

# Print summary
model.summary()


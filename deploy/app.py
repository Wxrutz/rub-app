from flask import Flask, request, jsonify
from flask_cors import CORS  # Correct import
import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model
import io
from PIL import Image

# Create a Flask app
app = Flask(__name__)
CORS(app)

# Load the model
model = load_model('./models/test1RMS_mobilenet.keras')

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Read the image file
        img = Image.open(io.BytesIO(file.read()))
        img = img.resize((224, 224))
        img = img.convert("RGB")

        # Convert the image to numpy array and normalize
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # Predict results
        predictions = model.predict(img_array)

        # Debug output
        print("Raw predictions:", predictions)

        # Process predictions
        if predictions.shape[1] == 3:  # Multi-class classification
            class_names = ['1-3', '4-6', '7-30']
            predicted_class = np.argmax(predictions, axis=1)
            result = class_names[predicted_class[0]]
            accuracy = round(float(np.max(predictions) * 100), 2)  # Calculate accuracy as confidence
            return jsonify({'result': result, 'accuracy': accuracy, 'predictions': predictions.tolist()})
        else:
            return jsonify({'error': 'Unexpected output shape from model'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

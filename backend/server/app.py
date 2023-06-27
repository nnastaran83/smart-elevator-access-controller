import os

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import base64
from PIL import Image
from io import BytesIO
from postgres_module.postgres_actions import PostgresModel

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173"]}})

# -------------------------------------------------------------------------------------
# # Create a table in the database
# PostgresModel.create_registered_table()
PostgresModel.create_approved_table()

# # Define the directory where your images are located
# image_dir = "people_images"
#
## Use glob to match jpg and png image file types
# images = glob.glob(os.path.join(image_dir, "*.[jJ][pP][gG]")) + glob.glob(os.path.join(image_dir, "*.[pP][nN][gG]"))
#
# for image_path in images:
#    # Now you can load and process each image
#    # Get the base name (i.e., the file name with its extension)
# base_name = os.path.basename("people_images/nas.jpg")
# Split the base name into the file name and the extension
# file_name, extension = os.path.splitext(base_name)
# PostgresModel.store_face_encoding(name=file_name, image_path="people_images/nas.jpg")

PostgresModel.memorize_approval(image_path="people_images/Joe Biden.jpg", floor_number=3)
PostgresModel.memorize_approval(image_path="people_images/nas.jpg", floor_number=2)


@app.route('/get_registered_users', methods=['GET'])
def get_registered_users():
    result = PostgresModel.get_registered_users()
    return jsonify(result)


@app.route('/recognize_face', methods=['POST'])
def recognize_face():
    # Get JSON data from an HTTP request.
    data = request.get_json()
    frame_data = data['frame_data']

    # Decode the base64-encoded image
    img_data = base64.b64decode(frame_data.split(',')[1])
    img = Image.open(BytesIO(img_data))
    img_array = np.array(img)
    info = PostgresModel.recognize_face(img_array)

    return jsonify(info)


@app.route('/check_access_permission', methods=['POST'])
def check_access_permission():
    # Get JSON data from an HTTP request.
    data = request.get_json()
    frame_data = data['frame_data']
    floor_number = data['floor_number']

    # Decode the base64-encoded image
    img_data = base64.b64decode(frame_data.split(',')[1])
    img = Image.open(BytesIO(img_data))
    img_array = np.array(img)
    info = PostgresModel.check_access_permission(img_array, floor_number)

    return jsonify(info)


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)

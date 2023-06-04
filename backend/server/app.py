import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
import configparser
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
import face_recognition
import numpy as np
import base64
from PIL import Image
from io import BytesIO
from model.mongo_db import Model
import configparser
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from threading import Lock
import json

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": ["http://localhost:5173"]}})

# Load reference images and compute face encodings
# joe_image = face_recognition.load_image_file("people_images/1.jpg")
# nastaran_image = face_recognition.load_image_file("people_images/6.jpg")
#
# joe_encoding = face_recognition.face_encodings(joe_image)[0]
# nastaran_encoding = face_recognition.face_encodings(nastaran_image)[0]
#
# known_face_encodings = [joe_encoding, nastaran_encoding]

known_face_encodings = []
known_face_names = ["Joe", "Nastaran"]

# get all face_encodings from DB
print("Loading face encodings from DB...")
known_face_encodings_from_mongo = Model.get_all_face_encodings()
for face_encoding_dict in known_face_encodings_from_mongo:
    known_face_encodings.append(
        np.array(face_encoding_dict["face_encoding"]))
print("Loaded face encodings from DB successfully")


@app.route('/get_registered_users', methods=['GET'])
def get_registered_users():
    result = Model.get_registered_users()
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

    # Perform face detection and recognition
    face_locations = face_recognition.face_locations(img_array)
    if len(face_locations) == 0:
        return jsonify({"name": "No face detected"})

    face_encodings = face_recognition.face_encodings(img_array, face_locations)
    face_encoding = face_encodings[0]

    # Find the best match
    matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
    face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
    best_match_index = np.argmin(face_distances)

    if matches[best_match_index]:
        # name = known_face_names[best_match_index]
        name = Model.get_user_info(known_face_encodings[best_match_index])['name']
        floor_number = Model.get_user_info(known_face_encodings[best_match_index])['floor_number']

    else:
        name = "Unknown"
        floor_number = "Unknown"

    return jsonify({"name": name, "floor_number": floor_number})


@app.route('/my-endpoint', methods=['POST'])
def my_endpoint():
    data = request.get_json()
    face_data = data['face_data']
    return jsonify({'status': 'ok', 'face_data': face_data})


@app.route('/db')
def db():
    """
    :return: database instance
    """

    config = configparser.ConfigParser()
    config.read("configuration_file.ini")

    SMART_ELEVATOR_SYSTEM_DB_URI = config.get("CONNECTION_DATA", "SMART_ELEVATOR_SYSTEM_DB_URI")
    SMART_ELEVATOR_SYSTEM_DB_NAME = config.get("CONNECTION_DATA", "SMART_ELEVATOR_SYSTEM_DB_NAME")

    db_instance = MongoClient(
        SMART_ELEVATOR_SYSTEM_DB_URI,
        maxPoolSize=3,
        connectTimeoutMS=2500)[SMART_ELEVATOR_SYSTEM_DB_NAME]

    return db_instance


@app.route('/add_user')
def add_user(name: str, face_encoding, floor_number: int):
    """
    Given a name, face_encoding and the floor number, inserts a document with those credentials
    to the `users_info` collection.
    """

    try:
        db().users_info.insert_one({
            "name": name,
            "face_encoding": face_encoding,
            "floor_number": floor_number
        })
        return {"success": True}
    except DuplicateKeyError:
        return {"error": "A user with these information already exists."}


@app.route('/get_all_face_encodings')
def get_all_face_encodings():
    """
    :return: all face encodings in the database
    """
    m_filter = {}
    project = {
        '_id': 0,
        'face_encoding': 1
    }

    result = db().users_info.find(
        filter=m_filter,
        projection=project
    )
    return list(result)


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)

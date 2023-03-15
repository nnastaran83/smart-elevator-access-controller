import sys
from flask import Flask, request, jsonify
from flask import url_for
from flask_cors import CORS
import configparser
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from twilio.rest import Client
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import VideoGrant, VoiceGrant

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173"]}})


@app.route('/my-endpoint', methods=['POST'])
def my_endpoint():
    data = request.get_json()
    face_data = data['face_data']
    # age = data['']
    return jsonify({'status': 'ok', 'face_data': face_data})


@app.route('/')
def hello():  # put application's code here
    return 'Hello World!'


@app.route('/db')
def db():
    """
    Configuration method to return db instance
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


@app.route('/')
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


@app.route('/')
def get_user_info(face_encoding):
    """
    :return: users information with this face_encoding
    """

    m_filter = {
        'face_encoding': list(face_encoding)
    }

    project = {}

    result = db().users_info.find(
        filter=m_filter
    )

    return list(result)[0]


if __name__ == '__main__':
    app.run()

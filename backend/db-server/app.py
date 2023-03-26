import sys
from flask import Flask, request, jsonify
from flask import url_for
from flask_cors import CORS
import configparser
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import VideoGrant, VoiceGrant
from twilio.rest import Client
from flask_socketio import SocketIO, emit, join_room
from threading import Thread

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173"]}})
ACCOUNT_SID = 'replace'
API_KEY_SID = 'replace'
API_KEY_SECRET = 'replace'
AUTH_TOKEN = 'replace'
TWILIO_PHONE_NUMBER = "replace"
phone_number = "replace"
verify_sid = "replace"
twilio_client = Client(ACCOUNT_SID, AUTH_TOKEN)


# @app.route('/video_call', methods=['GET', 'POST'])
# def video_call():
#     # create a separate SocketIO instance for this route
#     socketio = SocketIO(app, async_mode='threading',
#                         cors_allowed_origins="http://localhost:5173")
#     print('server is listening for video connections')
#
#     # define event handlers for this SocketIO instance
#     @socketio.on('connection')
#     def handle_connect():
#         print('connnnnnn')
#         return 'new user is connected'
#
#     @socketio.on('disconnect')
#     def handle_disconnect():
#         return 'user disconnected'
#
#     # emit a message to the client using this SocketIO instance
#     socketio.emit('my-message', {'data': 'Hello, world!'})
#     # start the listening process on this SocketIO instance
#     socketio_thread = Thread(target=socketio.run, args=(app,))
#     socketio_thread.start()
#     return 'Video call in progress'


# @app.route('/token', methods=['GET'])
# def token():
#     identity = request.args.get('identity')
#
#     token = AccessToken(ACCOUNT_SID, API_KEY_SID, API_KEY_SECRET, identity=identity)
#     video_grant = VideoGrant()
#     token.add_grant(video_grant)
#
#     return jsonify({'token': token.to_jwt()})


@app.route('/send_sms', methods=['POST'])
def send_sms():
    # Set environment variables for your credentials
    # Read more at http://twil.io/secure

    # client = Client(ACCOUNT_SID, AUTH_TOKEN)

    #  verification = client.verify.v2.services(verify_sid).verifications.create(to=TWILIO_PHONE_NUMBER, channel="sms")
    #  print(verification.status)
    #
    #  otp_code = input("Please enter the OTP:")
    #
    #  verification_check = client.verify.v2.services(verify_sid).verification_checks.create(to=TWILIO_PHONE_NUMBER,
    #                                                                                        code=otp_code)
    #  print(verification_check.status)
    phone_number = request.form.get('phone_number')
    room_name = request.form.get('room_name')

    message = twilio_client.messages.create(
        body=f"Join the video call: https://smart.com/video?room={room_name}",
        from_=TWILIO_PHONE_NUMBER,
        to=phone_number
    )

    return jsonify({'status': 'success', 'message_sid': message.sid})


@app.route('/my-endpoint', methods=['POST'])
def my_endpoint():
    data = request.get_json()
    face_data = data['face_data']
    return jsonify({'status': 'ok', 'face_data': face_data})


@app.route('/')
def hello():  # put application's code here
    return 'Hello World!'


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
    app.run(host='0.0.0.0', debug=True)

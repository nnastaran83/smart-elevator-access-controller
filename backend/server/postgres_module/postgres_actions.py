import psycopg2
import face_recognition
from threading import Lock
from psycopg2.extras import DictCursor


class PostgresModel:
    """
    This class is responsible for all the database operations
    """
    connection = None
    cursor = None
    _lock1: Lock = Lock()

    @classmethod
    def get_connection(cls):
        """
        Connects to the database and returns the connection object
        :return:
        """
        if cls.connection is None:
            with cls._lock1:
                if cls.connection is None:
                    print("Creating connection")
                    cls.connection = psycopg2.connect(database="Smart",
                                                      host="localhost",
                                                      user="postgres",
                                                      password="9732814",
                                                      port="5432")

                    cls.connection.set_session(autocommit=True)

        return cls.connection

    @classmethod
    def get_cursor(cls):
        """
        Returns the cursor object
        :return:
        """
        return cls.get_connection().cursor(cursor_factory=DictCursor)

    @classmethod
    def create_registered_table(cls):
        """
        Creates the table registered if it doesn't exist.
        registered table stores the name, face encoding, floor number, uid, messaging token and email of the registered user
        :return:
        """

        # Execute a command: this creates a new table
        with cls.get_cursor() as cursor:
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS registered (
                name VARCHAR(255),
                face_encoding FLOAT[],
                floor_number INTEGER,
                uid TEXT,
                messaging_token TEXT,
                email TEXT
                )
             """)

    @classmethod
    def create_approved_table(cls):
        """
        Creates the approved table if it doesn't exist.
        approved table stores the face encoding and floor number of the approved user.
        :return:
        """

        # Execute a command: this creates a new table
        with cls.get_cursor() as cursor:
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS approved (
                face_encoding FLOAT[] UNIQUE NOT NULL,
                floor_number INTEGER,
                access_date TIMESTAMP NOT NULL DEFAULT NOW()
                )
             """)

    @classmethod
    def store_face_encoding(cls, name, image_path):
        """
        Stores the face encoding of the image in the database
        :param name:
        :param image_path:
        :return:
        """
        # Load the image file
        picture = face_recognition.load_image_file(image_path)

        # Get the face encodings for the picture
        face_encodings = face_recognition.face_encodings(picture)

        if len(face_encodings) > 0:
            with cls.get_connection().cursor() as cursor:
                # Insert the name and face_encoding into the people table
                cursor.execute("""
                    INSERT INTO registered (name, face_encoding)
                    VALUES (%s, %s)
                    """, (name, list(face_encodings[0])))

        return True

    @classmethod
    def memorize_approval(cls, img_array, floor_number):
        """
        Stores the face encoding of the image in the database
        :param img_array:
        :param floor_number:
        :return:
        """

        # Get the face encodings for the picture
        face_encodings = face_recognition.face_encodings(img_array)

        if len(face_encodings) > 0:
            with cls.get_connection().cursor() as cursor:
                # Insert the name and face_encoding into the people table
                cursor.execute("""
                    INSERT INTO approved (face_encoding, floor_number)
                    VALUES (%s, %s)
                    ON CONFLICT (face_encoding) 
                    DO UPDATE SET floor_number = EXCLUDED.floor_number, access_date = NOW()
                    """, (list(face_encodings[0]), floor_number))

        return True

    @classmethod
    def recognize_face(cls, img_array):
        """
         Recognizes the face in the image
         :param img_array:
         :return:
         """
        best_match_name = None
        best_floor_number = None
        best_match_uid = None

        # Get the face encodings for the picture
        new_face_encodings = face_recognition.face_encodings(img_array)
        if len(new_face_encodings) == 0:
            return None

        if len(new_face_encodings) > 0:
            new_face_encoding = new_face_encodings[0]

            with cls.get_cursor() as cursor:
                # Get all the face encodings from the people table
                cursor.execute("""
                    SELECT name, face_encoding, floor_number, uid
                    FROM registered
                """)

                min_distance = 0.7  # Maximum possible distance is 1.0
                best_match_name = "Unknown"
                best_match_encoding = None
                best_floor_number = None
                best_match_uid = None

                # Iterate over each stored face encoding
                for name, face_encoding, floor_number, uid in cursor:
                    distance = face_recognition.face_distance([face_encoding], new_face_encoding)

                    # If this face is more similar than the best match so far, update best match
                    if distance < min_distance:
                        min_distance = distance
                        best_match_name = name
                        best_match_encoding = face_encoding
                        best_floor_number = floor_number
                        best_match_uid = uid
                        if min_distance < 0.6:
                            break

                # If no match was found in the registered table, check if the person is approved in the past
                if best_match_uid is None:
                    print("checking approved table")
                    # Get all the face encodings from the people table
                    cursor.execute("""
                           SELECT face_encoding, floor_number
                           FROM approved
                           ORDER BY access_date DESC
                       """)

                    # Iterate over each stored face encoding
                    for face_encoding, floor_number in cursor:
                        results = face_recognition.compare_faces([face_encoding], new_face_encoding, tolerance=0.6)
                        if results[0]:
                            best_floor_number = floor_number
                            break

        return {"name": best_match_name, "floor_number": best_floor_number, "uid": best_match_uid}

    @classmethod
    def check_access_permission(cls, img_array, floor_number):
        """
        Checks if the person has access permission to the floor
        :param img_array:
        :param floor_number:
        :return:
        """
        # Get the face encodings for the picture
        new_face_encodings = face_recognition.face_encodings(img_array)
        access_permission = False

        if len(new_face_encodings) > 0:
            new_face_encoding = new_face_encodings[0]

            with cls.get_cursor() as cursor:
                # Get all the face encodings from the registered and approved table for this specific floor
                cursor.execute("""
                    (SELECT face_encoding, floor_number
                     FROM registered
                     WHERE floor_number = %s)
                    UNION
                    (SELECT face_encoding, floor_number
                     FROM approved
                     WHERE floor_number = %s)
                """, (floor_number, floor_number,))

                # Iterate over each stored face encoding from floor_number
                for face_encoding, floor_number in cursor:
                    print(face_encoding, floor_number)
                    results = face_recognition.compare_faces([face_encoding], new_face_encoding, tolerance=0.7)
                    print(results)
                    if results[0]:
                        access_permission = True
                        break

        return {"access_permission": access_permission}

    @classmethod
    def get_registered_users(cls):
        """
        :return: all registered users in the database
        :return: iterable cursor
        """
        with cls.get_cursor() as cursor:
            cursor.execute("""
                SELECT name, uid, floor_number, messaging_token, email
                FROM registered
                WHERE uid IS NOT NULL
                ORDER BY floor_number ASC
            """)
            result = cursor.fetchall()
            # define column names
            columns = ['name', 'uid', 'floor_number', 'messaging_token', 'email']

            # convert list of tuples into list of dictionaries
            result = [dict(zip(columns, row)) for row in result]

            return result

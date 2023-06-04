from waitress import serve
from app import *


# cd backend/server
# in commandline : waitress-serve --call 'server:create_app'
def create_app(environ, start_response):
    """
    :param environ:
    :param start_response:
    :return:
    """
    return app(environ, start_response)


serve(create_app, listen='127.0.0.1:5000')

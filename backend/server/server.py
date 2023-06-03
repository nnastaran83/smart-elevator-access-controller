from waitress import serve
from app import *


# cd backend/server
# in commandline :
def smart_backend(environ, start_response):
    """
    :param environ:
    :param start_response:
    :return:
    """

    return app(environ, start_response)


serve(smart_backend, listen='127.0.0.1:5000')

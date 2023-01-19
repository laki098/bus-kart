from db.DB import DB
from flask import (Blueprint, redirect, render_template, request, session,
                   url_for, Response)

from models.user import User

user_services = Blueprint("user_services", __name__)

@user_services.route('/login', methods=['POST'])
def login():
    msg = ''
    if 'username' in request.json and 'password' in request.json:
        username = request.json['username']
        password = request.json['password']

        print(request.json)
        is_username = DB.select_query(
            'SELECT COUNT(username) FROM user WHERE username = %s', (username,))
        is_username = is_username[0]['COUNT(username)']

        if is_username == 1:
            stored_password = DB.select_query(
                'SELECT password FROM user WHERE username = %s', (username,))
            stored_password = stored_password[0]['password']

            if User.verify_password(stored_password, password):
                session['loggedin'] = True
                session['username'] = username
                return Response(status=200)
            else:
                msg = 'Username and/or password is not correct!'
                return msg, 422
        else:
            msg = 'Username and/or password is not correct!'
            return msg, 422
    else:
        msg = 'Check your details, and try to login again!'
        return {"error":msg}, 422

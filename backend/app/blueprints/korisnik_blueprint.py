import jwt
from db.DB import DB
from functools import wraps
from util.check_data import check_parameters, default_values
from upload import upload_file
from flask import (Blueprint, redirect, render_template, request, session,
                   url_for, Response, jsonify, current_app)
from constants.http_status_codes import HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_401_UNAUTHORIZED, HTTP_409_CONFLICT
from models.korisnik import Korisnik


def login_required(fnc):
    @wraps(fnc)
    def wrap(*args, **kwargs):
        if 'loggedin' in session:
            return fnc(*args, **kwargs)
        else:
            return redirect(url_for('user_services.login_page'))
    return wrap


korisnik_services = Blueprint("korisnik_services", __name__)


def generate_token(role):
    # pravljenje tokena za role korisnika, kako ne bi mogli da vide na frontu koji je role
    secret = current_app.secret_key
    # zato sto admin ima neke fukcije koje nemaju korisnici
    payload = {"role": role}
    token = jwt.encode(payload, secret, algorithm='HS256')
    return token


@korisnik_services.route('/login', methods=['POST'])
def login():
    msg = ''
    if 'korisnickoIme' in request.json and 'lozinka' in request.json:
        korisnickoIme = request.json['korisnickoIme']
        lozinka = request.json['lozinka']

        print(request.json)
        is_korisnickoIme = DB.select_query(
            'SELECT COUNT(korisnickoIme) FROM korisnik WHERE korisnickoIme = %s', (korisnickoIme,))
        is_korisnickoIme = is_korisnickoIme[0]['COUNT(korisnickoIme)']

        if is_korisnickoIme == 1:
            stored_lozinka = DB.select_query(
                'SELECT lozinka FROM korisnik WHERE korisnickoIme = %s', (korisnickoIme,))
            stored_lozinka = stored_lozinka[0]['lozinka']

            if Korisnik.verify_lozinka(stored_lozinka, lozinka):
                session['loggedin'] = True
                session['korisnickoIme'] = korisnickoIme
                userRole = DB.select_query(
                    'SELECT role FROM korisnik WHERE korisnickoIme = %s', (korisnickoIme,))
                userRole = userRole[0]['role']
                token = generate_token(userRole)
                session['role'] = token

                return {"role": token}, 200
            else:
                msg = 'korisnickoIme and/or lozinka is not correct!!'
                return msg, 422
        else:
            msg = 'korisnickoIme and/or lozinka is not correct!!!'
            return msg, 422
    else:
        msg = 'Check your details, and try to login again!'
        return {"error": msg}, 422


@korisnik_services.route("/registration", methods=['GET', 'POST'])
def registration():

    mydb = DB.connect()
    cursor = mydb.cursor(prepared=True)
    data = request.json

    korisnickoIme = data["korisnickoIme"]
    ime = data["ime"]
    prezime = data["prezime"]
    brojTelefona = data["brojTelefona"]
    email = data["email"]
    lozinka = Korisnik.hash_lozinka(data["lozinka"])
    data['lozinka'] = lozinka
    role = 'korisnik'

    form_korisnik = [korisnickoIme, lozinka,
                     ime, prezime, brojTelefona, email, role]

    photoUrl = upload_file()

    if photoUrl == False:
        return render_template("register.html", file_error="Invalid type of file!", korisnickoIme=form_korisnik[0], lozinka=form_korisnik[1], ime=form_korisnik[2], prezime=form_korisnik[3], brojTelefona=form_korisnik[4], email=email[5], role=role[6])

    cursor = mydb.cursor(prepared=True)
    q = "INSERT INTO korisnik VALUES(null,%s,%s,%s,%s,%s,%s,%s)"
    all_keys = ["korisnickoIme", "lozinka", "ime",
                "prezime", "brojTelefona", "email", "role"]
    data = default_values(data, all_keys)
    parameters = (
        data["korisnickoIme"],
        data["lozinka"],
        data["ime"],
        data["prezime"],
        data["brojTelefona"],
        data["email"],
        role
    )
    cursor.execute(q, parameters)
    mydb.commit()

    return Response(status=200)

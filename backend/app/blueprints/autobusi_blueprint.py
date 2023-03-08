from flask import (Blueprint, jsonify, flash, redirect,
                   url_for, request, render_template, Response)
from db.DB import DB
from util.check_data import default_values
from upload import upload_file

autobusi_services = Blueprint("autobusi_service", __name__)


@autobusi_services.route("/autobusiNov", methods=['GET', 'POST'])
def autobusiNov():

    mydb = DB.connect()
    cursor = mydb.cursor(prepared=True)
    data = request.json

    tablica = data["tablica"]
    brojMesta = data["brojMesta"]

    form_autobusi = [tablica, brojMesta]
    photoUrl = upload_file()

    if photoUrl == False:
        return render_template(file_error="Invalid type of file!", tablica=form_autobusi[0], brojMesta=form_autobusi[1])

    cursor = mydb.cursor(prepared=True)
    q = "INSERT INTO autobusi VALUE (null, %s,%s)"

    all_keys = ["tablica", "brojMesta"]

    data = default_values(data, all_keys)

    parametars = (
        data["tablica"],
        data["brojMesta"]
    )

    cursor.execute(q, parametars)
    mydb.commit()

    return Response(status=200)

from flask import (Blueprint, request, render_template, Response)
from db.DB import DB
from upload import upload_file
from util.check_data import default_values

linije_services = Blueprint("linije_services", __name__)

@linije_services.route("/linijeNov", methods=['GET', 'POST'])
def linijeNov():

    mydb = DB.connect()
    cursor = mydb.cursor(prepared = True)
    data = request.json

    mestoPolaska = data["mestoPolaska"]
    mestoDolaska = data["mestoDolaska"]
    vremePolaska = data["vremePolaska"]
    vremeDolaska = data["vremeDolaska"]
    prevoznik = data["prevoznik"]

    form_linija = [mestoPolaska, mestoDolaska, vremePolaska, vremeDolaska, prevoznik]


    photoUrl = upload_file()

    if photoUrl == False:
        return render_template(file_error="Invalid type of file!", mestoPolaska=form_linija[0], mestoDolaska=form_linija[1], vremePolaska=form_linija[2], vremeDolaska=form_linija[3], prevoznik=form_linija[4])


    cursor = mydb.cursor(prepared=True)
    q = "INSERT INTO linija VALUES(null,%s, %s, %s, %s, %s)"
    all_keys = ["mestoPolaska", "mestoDolaska", "vremePolaska", "vremeDolaska", "prevoznik"]
    data = default_values(data, all_keys)
    parameters = (
        data["mestoPolaska"],
        data["mestoDolaska"],
        data["vremePolaska"],
        data["vremeDolaska"],
        data["prevoznik"]
    )
    cursor.execute(q, parameters)
    mydb.commit()

    return Response(status=200)
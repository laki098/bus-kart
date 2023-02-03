from flask import (Blueprint,jsonify ,request, render_template, Response)
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

@linije_services.route("/linija", methods=["GET"])
def linije():
    mydb = DB.connect()
    cursor = mydb.cursor(prepared=True)
    cursor.execute("SELECT * FROM bus.linije")
    row = cursor.fetchall()
    list_linije = []
    for linija in row:
        list_linije.append({
            'id': linija[0],
            'mestoPolaska': linija[1],
            'mestoDolaska': linija[2],
            'vremePolaska': linija[3],
            'vremeDolaska': linija[4],
            'prevoznik': linija[5]
        })

  
    return jsonify(list_linije)
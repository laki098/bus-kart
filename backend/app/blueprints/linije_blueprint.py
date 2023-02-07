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
    datumPolaska = data["datumPolaska"]
    datumDolaska = data["datumDolaska"]

    form_linija = [mestoPolaska, mestoDolaska, vremePolaska, vremeDolaska, prevoznik, datumPolaska, datumDolaska]


    photoUrl = upload_file()

    if photoUrl == False:
        return render_template(file_error="Invalid type of file!", mestoPolaska=form_linija[0], mestoDolaska=form_linija[1], vremePolaska=form_linija[2], vremeDolaska=form_linija[3], prevoznik=form_linija[4], datumPolaska=form_linija[5], datumDolaska=form_linija[6])


    cursor = mydb.cursor(prepared=True)
    q = "INSERT INTO linija VALUES(null,%s, %s, %s, %s, %s, %s, %s)"
    all_keys = ["mestoPolaska", "mestoDolaska", "vremePolaska", "vremeDolaska", "prevoznik", "datumPolaska" , "datumDolaska"]
    data = default_values(data, all_keys)
    parameters = (

        data["mestoPolaska"],
        data["mestoDolaska"],
        data["vremePolaska"],
        data["vremeDolaska"],
        data["prevoznik"],
        data["datumPolaska"],
        data["datumDolaska"]
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
    def toHrs(seconds):
        seconds = seconds % (24 * 3600)
        hour = seconds // 3600
        seconds %= 3600
        minutes = seconds // 60
        seconds %= 60
        return "%d:%02d:%02d" % (hour, minutes, seconds)
    list_linije = []
    for linija in row:
        list_linije.append({
            'id': linija[0],
            'mestoPolaska': linija[1],
            'mestoDolaska': linija[2],
            'vremePolaska': toHrs(linija[3].seconds),
            'vremeDolaska': toHrs(linija[4].seconds),
            'prevoznik': linija[5],
            'datumPolaska': str(linija[6].year) + '-' + str(linija[6].month) + '-' + str(linija[6].day),
            'datumDolaska': str(linija[7].year) + '-' + str(linija[7].month) + '- ' + str(linija[7].day)
        })

  
    return jsonify(list_linije)

@linije_services.route("/filterLinija", methods=["POST"])
def filterLinije():
    a = request
    mestoPolaska = request.json['mestoPolaska']
    mestoDolaska = request.json['mestoDolaska']
    datumPolaska = request.json['datumPolaska']
    mydb = DB.connect()
    cursor = mydb.cursor(prepared=True)
    cursor.execute("SELECT * FROM bus.linije WHERE mestoPolaska=%s AND mestoDolaska=%s AND datumPolaska=%s ",(mestoPolaska, mestoDolaska, datumPolaska))
    row = cursor.fetchall()
    def toHrs(seconds):
        seconds = seconds % (24 * 3600)
        hour = seconds // 3600
        seconds %= 3600
        minutes = seconds // 60
        seconds %= 60
        return "%d:%02d:%02d" % (hour, minutes, seconds)
    
    list_linije = []
    for linija in row:
        list_linije.append({
            'id': linija[0],
            'mestoPolaska': linija[1],
            'mestoDolaska': linija[2],
            'vremePolaska': toHrs(linija[3].seconds),
            'vremeDolaska': toHrs(linija[4].seconds),
            'prevoznik': linija[5],
            'datumPolaska': str(linija[6].year) + ', ' + str(linija[6].month) + ', ' + str(linija[6].day),
            'datumDolaska': str(linija[7].year) + ', ' + str(linija[7].month) + ', ' + str(linija[7].day)
        })


    return jsonify(list_linije)